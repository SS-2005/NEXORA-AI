from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from backend.app.db.session import get_db
from backend.app.db import models
from backend.app.services.pdf_generator import generate_report_pdf

router = APIRouter()

# High-quality default pre-feasibility analysis data for Kenya's 300 MW SMR program
# This matches the calculations and assumptions described in the README and UI components.
DEFAULT_KENYA_SMR_DATA = {
    "project_name": "Kenya 300 MW SMR Program",
    "readiness": {
        "overall_score": 72,
        "overall_grade": "B",
        "risk_level": "moderate",
        "categories": {
            "Policies & Regulation": 65,
            "Financing & Economy": 55,
            "Human Resources": 78,
            "Stakeholders & PR": 82,
            "Infrastructure & Grid": 80
        },
        "recommendations": [
            "Pass the draft Nuclear Regulatory Bill through Parliament to establish the independent KNRA.",
            "Establish a clear liability framework and sign the Vienna Convention on Civil Liability for Nuclear Damage.",
            "Formulate the Power Purchase Agreement (PPA) structure between NuPEA and KPLC.",
            "Conduct detailed Rift Valley seismic monitoring and site characterization studies."
        ]
    },
    "hr": {
        "current_capacity": {
            "Nuclear Engineering": 12,
            "Project Management": 24,
            "Safety Inspection": 8,
            "Radiation Protection": 32
        },
        "required_capacity": {
            "Nuclear Engineering": 45,
            "Project Management": 60,
            "Safety Inspection": 25,
            "Radiation Protection": 50
        },
        "upskilling_strategies": [
            "Establish specialized MSc Nuclear Science tracks at the University of Nairobi.",
            "Launch joint sandwich PhD programs with international universities (e.g., in Turkey or South Korea).",
            "Set up hands-on technician training programs at JKUAT and regional Technical Training Institutes (TTIs).",
            "Provide regulatory internship placements at the Nuclear Regulatory Authority (KNRA)."
        ]
    },
    "financing": {
        "total_estimated_cost_usd_m": 4800,
        "secured_funding_usd_m": 3360,
        "funding_gap_usd_m": 1440,
        "feasibility_score": 75,
        "lcoe_estimate_usd_mwh": 204,
        "payback_period_years": 15.0,
        "irr_pct": 7.5,
        "investment_recommendations": "Given Kenya's GDP, the SMR project represents a significant capital expenditure, requiring a structured 70/30 debt-equity model to protect public debt limits. ECA vendor financing combined with DFI concessional loans forms the core debt structure, backed by sovereign equity.",
        "sources": [
            {"name": "ECA / Vendor Debt (50%)", "amount": 2400, "rate": "4.5%", "terms": "20 Years", "conditions": "Requires sovereign guarantee"},
            {"name": "Concessional / DFI Debt (20%)", "amount": 960, "rate": "2.5%", "terms": "30 Years", "conditions": "ESG compliance & safety audit"},
            {"name": "Sovereign Equity (20%)", "amount": 960, "rate": "N/A", "terms": "N/A", "conditions": "National Treasury allocation"},
            {"name": "Utility & Strategic Equity (10%)", "amount": 480, "rate": "N/A", "terms": "N/A", "conditions": "KPLC board representation"}
        ]
    },
    "stakeholders": {
        "matrix": [
            {"name": "Ministry of Energy", "power": "High", "interest": "High", "sentiment": "Highly Positive (92%)"},
            {"name": "NuPEA", "power": "High", "interest": "High", "sentiment": "Highly Positive (98%)"},
            {"name": "NEMA", "power": "Medium", "interest": "High", "sentiment": "Neutral / Cautionary (60%)"},
            {"name": "KPLC", "power": "High", "interest": "Medium", "sentiment": "Positive (75%)"},
            {"name": "Host Communities", "power": "Low", "interest": "High", "sentiment": "Skeptical (45%)"}
        ],
        "insights": "Public opposition is largely driven by concerns over nuclear waste safety and Rift Valley geological activity. Active transparency, early local town halls, and clear communication on geological mapping (excluding active seismic zones) will build trust."
    },
    "roadmap": {
        "milestones": [
            {"phase": "Phase 1: Pre-Feasibility (Milestone 1)", "status": "Completed (90%)", "description": "National position established, nuclear steering committee formed, pre-feasibility completed."},
            {"phase": "Phase 2: Licensing & Site (Milestone 2)", "status": "In Progress (30%)", "description": "Enactment of Nuclear Regulatory Bill, site selection clearance, grid integration study."},
            {"phase": "Phase 3: EPC & Construction (Milestone 3)", "status": "Pending", "description": "Reactor technology selection, EPC contract signing, final site licensing, construction start."}
        ]
    }
}

@router.get("/{project_id}/generate_pdf")
async def generate_pdf(project_id: str, db: AsyncSession = Depends(get_db)):
    """
    Generates a McKinsey-style pre-feasibility PDF report for a given project.
    If the project does not exist in the database, falls back to the high-quality
    default Kenya 300 MW SMR reference case.
    """
    try:
        # Try to retrieve project with all relationships loaded eager-style
        stmt = (
            select(models.Project)
            .options(
                selectinload(models.Project.readiness),
                selectinload(models.Project.hr_intel),
                selectinload(models.Project.financing),
                selectinload(models.Project.stakeholders),
                selectinload(models.Project.roadmap)
            )
            .where(models.Project.id == project_id)
        )
        result = await db.execute(stmt)
        project = result.scalar_one_or_none()
        
        if not project:
            # Fallback to default data (ideal for demo/hackathon environment or un-persisted UI flow)
            data = DEFAULT_KENYA_SMR_DATA
        else:
            # Map frontend HR data format from DB to the format expected by the PDF generator
            hr_record = project.hr_intel
            hr_pdf_data = DEFAULT_KENYA_SMR_DATA["hr"]
            if hr_record and hr_record.current_capacity:
                hr_db = hr_record.current_capacity
                if isinstance(hr_db, dict) and "gaps" in hr_db:
                    current_capacity = {}
                    required_capacity = {}
                    upskilling_strategies = []
                    
                    total_current = hr_db.get("current_workforce_size", 100)
                    for gap_item in hr_db.get("gaps", []):
                        role = gap_item.get("role_category", "Unknown")
                        gap_val = gap_item.get("gap_count", 0)
                        
                        if "Engineer" in role:
                            curr_val = int(total_current * 0.15)
                        elif "Operator" in role:
                            curr_val = int(total_current * 0.2)
                        elif "Regulatory" in role:
                            curr_val = int(total_current * 0.1)
                        else: # Technicians
                            curr_val = max(0, total_current - (int(total_current * 0.15) + int(total_current * 0.2) + int(total_current * 0.1)))
                        
                        current_capacity[role] = curr_val
                        required_capacity[role] = curr_val + gap_val
                        
                    for prog in hr_db.get("programs", []):
                        upskilling_strategies.append(f"{prog.get('name')} at {prog.get('provider')} (Capacity: {prog.get('capacity')})")
                        
                    hr_pdf_data = {
                        "current_capacity": current_capacity,
                        "required_capacity": required_capacity,
                        "upskilling_strategies": upskilling_strategies
                    }
                else:
                    hr_pdf_data = {
                        "current_capacity": hr_record.current_capacity or DEFAULT_KENYA_SMR_DATA["hr"]["current_capacity"],
                        "required_capacity": hr_record.required_capacity or DEFAULT_KENYA_SMR_DATA["hr"]["required_capacity"],
                        "upskilling_strategies": hr_record.upskilling_strategies or DEFAULT_KENYA_SMR_DATA["hr"]["upskilling_strategies"]
                    }

            # Build data from database record
            data = {
                "project_name": project.name,
                "readiness": {
                    "overall_score": project.readiness.overall_score if project.readiness else 72,
                    "overall_grade": project.readiness.overall_grade if project.readiness else "B",
                    "risk_level": project.readiness.risk_level if project.readiness else "moderate",
                    "categories": project.readiness.categories if project.readiness else DEFAULT_KENYA_SMR_DATA["readiness"]["categories"],
                    "recommendations": project.readiness.recommendations if project.readiness else DEFAULT_KENYA_SMR_DATA["readiness"]["recommendations"],
                },
                "hr": hr_pdf_data,
                "financing": {
                    "total_estimated_cost_usd_m": project.financing.total_estimated_cost_usd_m if project.financing else 4800,
                    "secured_funding_usd_m": project.financing.secured_funding_usd_m if project.financing else 3360,
                    "funding_gap_usd_m": project.financing.funding_gap_usd_m if project.financing else 1440,
                    "feasibility_score": project.financing.feasibility_score if project.financing else 75,
                    "lcoe_estimate_usd_mwh": project.financing.lcoe_estimate_usd_mwh if project.financing else 204,
                    "payback_period_years": project.financing.payback_period_years if project.financing else 15.0,
                    "irr_pct": project.financing.irr_pct if project.financing else 7.5,
                    "investment_recommendations": project.financing.investment_recommendations if project.financing else DEFAULT_KENYA_SMR_DATA["financing"]["investment_recommendations"],
                    "sources": project.financing.sources if project.financing else DEFAULT_KENYA_SMR_DATA["financing"]["sources"],
                },
                "stakeholders": {
                    "matrix": project.stakeholders.matrix if project.stakeholders else DEFAULT_KENYA_SMR_DATA["stakeholders"]["matrix"],
                    "insights": project.stakeholders.insights if project.stakeholders else DEFAULT_KENYA_SMR_DATA["stakeholders"]["insights"],
                },
                "roadmap": {
                    "milestones": project.roadmap.milestones if project.roadmap else DEFAULT_KENYA_SMR_DATA["roadmap"]["milestones"],
                }
            }
            
        pdf_content = generate_report_pdf(data)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=NEXORA_Readiness_Report.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF: {str(e)}"
        )
