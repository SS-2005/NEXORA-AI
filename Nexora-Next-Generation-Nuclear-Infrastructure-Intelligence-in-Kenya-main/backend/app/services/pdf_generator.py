import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def draw_cover(canvas, doc):
    canvas.saveState()
    # Draw background dark gray top panel
    canvas.setFillColor(colors.HexColor("#1A202C"))
    canvas.rect(0, 480, 595.27, 361.89, fill=1, stroke=0)
    
    # Draw decorative gold accent line
    canvas.setFillColor(colors.HexColor("#D69E2E"))
    canvas.rect(0, 470, 595.27, 10, fill=1, stroke=0)
    
    # White logo & Title
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 36)
    canvas.drawString(54, 700, "NEXORA")
    
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawString(54, 640, "Next-Generation Nuclear Infrastructure Intelligence")
    
    canvas.setFont("Helvetica-Oblique", 14)
    canvas.setFillColor(colors.HexColor("#E2E8F0"))
    canvas.drawString(54, 600, "IAEA Milestone Pre-Feasibility Report — Republic of Kenya")
    
    # Bottom metadata blocks
    canvas.setFillColor(colors.HexColor("#2D3748"))
    
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(54, 280, "PREPARED FOR:")
    canvas.setFont("Helvetica", 11)
    canvas.drawString(54, 260, "Ministry of Energy & Petroleum")
    canvas.drawString(54, 242, "Kenya Nuclear Power and Energy Agency (NuPEA)")
    canvas.drawString(54, 224, "Nuclear Regulatory Authority (KNRA)")
    
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(54, 160, "PREPARED BY:")
    canvas.setFont("Helvetica", 11)
    canvas.drawString(54, 140, "NEXORA AI Readiness Assessment Engine")
    
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(340, 280, "PROGRAM SCOPE:")
    canvas.setFont("Helvetica", 11)
    canvas.drawString(340, 260, "300 MW Small Modular Reactor (SMR)")
    canvas.drawString(340, 242, "Grid Integration & Host Community Studies")
    
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(340, 160, "REPORT DATE:")
    canvas.setFont("Helvetica", 11)
    canvas.drawString(340, 140, datetime.now().strftime("%B %d, %Y"))
    
    # Footer disclaimer on cover
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor("#718096"))
    canvas.drawString(54, 50, "CONFIDENTIAL // FOR INTERNAL STATE USE ONLY")
    
    canvas.restoreState()

def draw_later_page(canvas, doc):
    canvas.saveState()
    # Running header
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor("#718096"))
    canvas.drawString(54, 802, "NEXORA  |  KENYA 300 MW SMR PROGRAM READINESS")
    
    # Running header line
    canvas.setStrokeColor(colors.HexColor("#E2E8F0"))
    canvas.setLineWidth(0.5)
    canvas.line(54, 794, 541.27, 794)
    
    # Running footer line
    canvas.line(54, 52, 541.27, 52)
    
    # Running footer
    canvas.drawString(54, 40, "CONFIDENTIAL // INTERNAL GOVERNMENT REVIEW ONLY")
    canvas.drawRightString(541.27, 40, f"Page {doc.page}")
    canvas.restoreState()

def generate_report_pdf(data: dict) -> bytes:
    buffer = io.BytesIO()
    
    # Letter size or A4 size (A4 is 595.27 x 841.89 points)
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=54,  # 0.75 in
        rightMargin=54,
        topMargin=72,   # 1.0 in
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Typography / Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1A202C"),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#2B6CB0"), # Slate Blue
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2D3748"),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=body_style,
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#7B341E"),
        backColor=colors.HexColor("#FFFBEB"), # Amber tint background
        borderColor=colors.HexColor("#F59E0B"),
        borderWidth=1,
        borderPadding=10,
        spaceBefore=10,
        spaceAfter=15
    )

    story = []
    
    # ------------------ PAGE 1: COVER PAGE ------------------
    # Handled by PageTemplate background, so we just add a page break.
    story.append(PageBreak())
    
    # ------------------ PAGE 2: EXECUTIVE SUMMARY & READINESS ------------------
    story.append(Paragraph("Executive Summary & Readiness Index", title_style))
    story.append(Spacer(1, 10))
    
    exec_summary_text = (
        "Kenya's SMR (Small Modular Reactor) Nuclear program represents a critical national initiative "
        "designed to supply baseload, carbon-free electricity to power the nation's industrial development. "
        "This pre-feasibility analysis evaluates Kenya's implementation progress relative to the IAEA Nuclear "
        "Infrastructure Milestones Approach. The assessment finds that Kenya is at a <b>Moderate Risk</b> level "
        "overall, with notable strengths in Government Alignment, Stakeholder Interests, and Grid planning, but "
        "displays crucial legislative and financial resource deficits requiring immediate policy intervention."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    
    story.append(Paragraph("Readiness Index Breakdown", h1_style))
    story.append(Paragraph(
        f"<b>Overall Score:</b> {data['readiness']['overall_score']}/100 | "
        f"<b>Readiness Grade:</b> {data['readiness']['overall_grade']} | "
        f"<b>Overall Risk Profile:</b> {data['readiness']['risk_level'].upper()}",
        body_style
    ))
    
    # Build Category Table
    table_data = [["Infrastructure Domain Issue (IAEA)", "Score", "Status / Gap Assessment"]]
    for category, score in data["readiness"]["categories"].items():
        status = "Optimal" if score >= 80 else "Progressing" if score >= 60 else "Critical Gap"
        table_data.append([category, f"{score}%", status])
        
    t_readiness = Table(table_data, colWidths=[220, 80, 187])
    t_readiness.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1A202C")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    story.append(t_readiness)
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("Key Strategic Action Recommendations:", h1_style))
    for rec in data["readiness"]["recommendations"]:
        story.append(Paragraph(f"• {rec}", bullet_style))
        
    story.append(PageBreak())
    
    # ------------------ PAGE 3: HR & FINANCING INTELLIGENCE ------------------
    story.append(Paragraph("Human Resource & Workforce Capability", title_style))
    story.append(Paragraph(
        "Deploying a 300 MW SMR program requires building a dedicated, highly trained national workforce "
        "across regulation, operator engineering, safety inspections, and waste management. Below is the "
        "projected manpower gap analysis mapped to Kenyan academic and training organizations.",
        body_style
    ))
    
    hr_table_data = [["Workforce Competency Area", "Current Capacity", "Target Requirement", "Deficit (Gap)"]]
    for domain, current in data["hr"]["current_capacity"].items():
        required = data["hr"]["required_capacity"].get(domain, current)
        gap = required - current
        gap_pct = round((gap / required) * 100) if required > 0 else 0
        hr_table_data.append([domain, f"{current} FTE", f"{required} FTE", f"-{gap} ({gap_pct}% Deficit)"])
        
    t_hr = Table(hr_table_data, colWidths=[200, 95, 95, 97])
    t_hr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2B6CB0")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    story.append(t_hr)
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("National Workforce Upskilling Program:", h1_style))
    for strategy in data["hr"]["upskilling_strategies"]:
        story.append(Paragraph(f"• {strategy}", bullet_style))
        
    story.append(Spacer(1, 15))
    story.append(Paragraph("Financing Models & Capital Structure", title_style))
    
    # Financial metrics callout summary
    fin = data["financing"]
    fin_summary_text = (
        f"<b>Total SMR Project Capital Cost:</b> ${fin['total_estimated_cost_usd_m']}M | "
        f"<b>Funding Gap:</b> ${fin['funding_gap_usd_m']}M (Feasibility Score: {fin['feasibility_score']}/100)<br/>"
        f"<b>Operating Economics:</b> LCOE of ${fin['lcoe_estimate_usd_mwh']}/MWh at 7.5% WACC | "
        f"<b>Payback:</b> {fin['payback_period_years']} Years (Project IRR: {fin['irr_pct']}%)"
    )
    story.append(Paragraph(fin_summary_text, callout_style))
    
    fin_table_data = [["Financing Instrument / Source", "Allocation ($M)", "Indicative Rate", "Maturity", "Lending Conditions"]]
    for src in fin["sources"]:
        fin_table_data.append([src["name"], f"${src['amount']}M", src["rate"], src["terms"], src["conditions"]])
        
    t_fin = Table(fin_table_data, colWidths=[160, 90, 80, 70, 87])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2C5282")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
        ('ALIGN', (1, 0), (3, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"<b>Investment Strategy Advisory Note:</b> {fin['investment_recommendations']}", body_style))
    
    story.append(PageBreak())
    
    # ------------------ PAGE 4: STAKEHOLDERS & ROADMAP ------------------
    story.append(Paragraph("Stakeholder Alignment & Public Sentiment", title_style))
    story.append(Paragraph(
        "A Power-Interest-Sentiment matrix highlights key state, regulatory, and public stakeholders "
        "whose interests must be managed to maintain social license to operate (SLO).",
        body_style
    ))
    
    sh_table_data = [["Stakeholder Group", "Influence / Power", "Interest Level", "Sentiment Profile"]]
    for sh in data["stakeholders"]["matrix"]:
        sh_table_data.append([sh["name"], sh["power"], sh["interest"], sh["sentiment"]])
        
    t_sh = Table(sh_table_data, colWidths=[150, 100, 100, 137])
    t_sh.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4A5568")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    story.append(t_sh)
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"<b>Public Relations & Social Risk Insights:</b> {data['stakeholders']['insights']}", body_style))
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("IAEA Milestones & Implementation Roadmap", title_style))
    
    road_table_data = [["IAEA Development Phase", "Current Status", "Key Phase Deliverables & Scope"]]
    for m in data["roadmap"]["milestones"]:
        road_table_data.append([m["phase"], m["status"], m["description"]])
        
    t_road = Table(road_table_data, colWidths=[160, 95, 232])
    t_road.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1A202C")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7FAFC")]),
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    story.append(t_road)
    
    # Build Document, Page templates setup
    doc.build(
        story,
        onFirstPage=draw_cover,
        onLaterPages=draw_later_page
    )
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
