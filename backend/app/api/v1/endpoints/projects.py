from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.session import get_db
from backend.app.db import models
from typing import Any

router = APIRouter()

async def get_or_create_project(db: AsyncSession, project_id: str) -> models.Project:
    """Helper to ensure a project exists in the database."""
    stmt = select(models.Project).where(models.Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    if not project:
        project = models.Project(id=project_id, name="Kenya SMR Program")
        db.add(project)
        await db.commit()
        await db.refresh(project)
    return project

# --- READINESS INDEX ENDPOINTS ---
@router.get("/{project_id}/readiness")
async def get_readiness(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.ReadinessIndex).where(models.ReadinessIndex.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Readiness record not found")
    return {
        "overall_score": record.overall_score,
        "overall_grade": record.overall_grade,
        "risk_level": record.risk_level,
        "categories": record.categories,
        "recommendations": record.recommendations,
        "formula": "Overall = Σ(Score_i × Weight_i × SMR_Factor_i) / Σ(Weight_i × SMR_Factor_i) × 100"
    }

@router.post("/{project_id}/readiness")
async def save_readiness(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.ReadinessIndex).where(models.ReadinessIndex.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.ReadinessIndex(project_id=project_id)
        db.add(record)
        
    record.overall_score = payload.get("overall_score", 72)
    record.overall_grade = payload.get("overall_grade", "B")
    record.risk_level = payload.get("risk_level", "moderate")
    record.categories = payload.get("categories", {})
    record.recommendations = payload.get("recommendations", [])
    
    await db.commit()
    return {"status": "success", "message": "Readiness index saved"}

# --- HR INTELLIGENCE ENDPOINTS ---
@router.get("/{project_id}/hr")
async def get_hr(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.HRIntelligence).where(models.HRIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="HR record not found")
    return {
        "current_capacity": record.current_capacity,
        "required_capacity": record.required_capacity,
        "upskilling_strategies": record.upskilling_strategies
    }

@router.post("/{project_id}/hr")
async def save_hr(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.HRIntelligence).where(models.HRIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.HRIntelligence(project_id=project_id)
        db.add(record)
        
    record.current_capacity = payload.get("current_capacity", {})
    record.required_capacity = payload.get("required_capacity", {})
    record.upskilling_strategies = payload.get("upskilling_strategies", [])
    
    await db.commit()
    return {"status": "success", "message": "HR intelligence saved"}

# --- FINANCING INTELLIGENCE ENDPOINTS ---
@router.get("/{project_id}/financing")
async def get_financing(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.FinancingIntelligence).where(models.FinancingIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Financing record not found")
    return {
        "total_estimated_cost_usd_m": record.total_estimated_cost_usd_m,
        "secured_funding_usd_m": record.secured_funding_usd_m,
        "funding_gap_usd_m": record.funding_gap_usd_m,
        "feasibility_score": record.feasibility_score,
        "lcoe_estimate_usd_mwh": record.lcoe_estimate_usd_mwh,
        "payback_period_years": record.payback_period_years,
        "irr_pct": record.irr_pct,
        "investment_recommendations": record.investment_recommendations,
        "sources": record.sources
    }

@router.post("/{project_id}/financing")
async def save_financing(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.FinancingIntelligence).where(models.FinancingIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.FinancingIntelligence(project_id=project_id)
        db.add(record)
        
    record.total_estimated_cost_usd_m = payload.get("total_estimated_cost_usd_m", 4800)
    record.secured_funding_usd_m = payload.get("secured_funding_usd_m", 3360)
    record.funding_gap_usd_m = payload.get("funding_gap_usd_m", 1440)
    record.feasibility_score = payload.get("feasibility_score", 75)
    record.lcoe_estimate_usd_mwh = payload.get("lcoe_estimate_usd_mwh", 204)
    record.payback_period_years = payload.get("payback_period_years", 15.0)
    record.irr_pct = payload.get("irr_pct", 7.5)
    record.investment_recommendations = payload.get("investment_recommendations", "")
    record.sources = payload.get("sources", [])
    
    await db.commit()
    return {"status": "success", "message": "Financing intelligence saved"}

# --- STAKEHOLDER INTELLIGENCE ENDPOINTS ---
@router.get("/{project_id}/stakeholders")
async def get_stakeholders(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.StakeholderIntelligence).where(models.StakeholderIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Stakeholder record not found")
    return {
        "overall_risk_analysis": record.insights,
        "stakeholders": record.matrix
    }

@router.post("/{project_id}/stakeholders")
async def save_stakeholders(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.StakeholderIntelligence).where(models.StakeholderIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.StakeholderIntelligence(project_id=project_id)
        db.add(record)
        
    record.insights = payload.get("overall_risk_analysis", "")
    record.matrix = payload.get("stakeholders", [])
    
    await db.commit()
    return {"status": "success", "message": "Stakeholder intelligence saved"}

# --- ROADMAP ENDPOINTS ---
@router.get("/{project_id}/roadmap")
async def get_roadmap(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.RoadmapMilestones).where(models.RoadmapMilestones.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Roadmap record not found")
    return {
        "version": 1,
        "phases": record.milestones
    }

@router.post("/{project_id}/roadmap")
async def save_roadmap(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.RoadmapMilestones).where(models.RoadmapMilestones.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.RoadmapMilestones(project_id=project_id)
        db.add(record)
        
    record.milestones = payload.get("phases", [])
    
    await db.commit()
    return {"status": "success", "message": "Roadmap saved"}

# --- MILESTONE ENDPOINTS ---
@router.get("/{project_id}/milestones")
async def get_milestones(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.MilestoneIntelligence).where(models.MilestoneIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Milestones record not found")
    return record.milestone_data

@router.post("/{project_id}/milestones")
async def save_milestones(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.MilestoneIntelligence).where(models.MilestoneIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.MilestoneIntelligence(project_id=project_id)
        db.add(record)
        
    record.milestone_data = payload
    
    await db.commit()
    return {"status": "success", "message": "Milestones saved"}

# --- BENCHMARKING ENDPOINTS ---
@router.get("/{project_id}/benchmarking")
async def get_benchmarking(project_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models.BenchmarkIntelligence).where(models.BenchmarkIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Benchmarking record not found")
    return record.benchmark_data

@router.post("/{project_id}/benchmarking")
async def save_benchmarking(project_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    await get_or_create_project(db, project_id)
    stmt = select(models.BenchmarkIntelligence).where(models.BenchmarkIntelligence.project_id == project_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        record = models.BenchmarkIntelligence(project_id=project_id)
        db.add(record)
        
    record.benchmark_data = payload
    
    await db.commit()
    return {"status": "success", "message": "Benchmarking saved"}
