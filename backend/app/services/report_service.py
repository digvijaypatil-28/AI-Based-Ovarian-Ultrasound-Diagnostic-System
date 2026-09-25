import os
import json
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from app.database.models import Analysis, Patient, User

CONDITION_DISPLAY_NAMES = {
    "complex_cyst": "Complex Cyst",
    "dominant_follicle": "Dominant Follicle",
    "healthy": "Healthy Ovarian Tissue",
    "poly_cyst": "Polycystic Ovary (PCOS Pattern)",
    "simple_cyst": "Simple Cyst"
}

CONDITION_DESCRIPTIONS = {
    "complex_cyst": "The AI classifier identified features consistent with a complex ovarian cyst (mixed solid and cystic components). Clinical follow-up with ultrasound / MRI evaluation is recommended.",
    "dominant_follicle": "The AI classifier identified features consistent with a dominant follicle (normal physiological finding in reproductive-age females during follicular phase).",
    "healthy": "The AI classifier identified normal, healthy ovarian parenchyma without abnormal cystic or solid lesion patterns.",
    "poly_cyst": "The AI classifier identified features characteristic of polycystic ovarian morphology (multiple small peripheral follicles). Correlation with clinical and hormonal profile is indicated.",
    "simple_cyst": "The AI classifier identified features consistent with a simple thin-walled fluid-filled cyst. Regular monitoring per clinical guidance is standard."
}

def generate_pdf_report(analysis: Analysis, patient: Patient, user: User, output_dir: str = "./reports") -> str:
    """
    Generates a professional PDF analysis report using ReportLab.
    Returns relative path to saved PDF.
    """
    os.makedirs(output_dir, exist_ok=True)
    pdf_filename = f"report_{analysis.id}.pdf"
    pdf_path = os.path.join(output_dir, pdf_filename)

    # Document setup
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#0F2C59")      # Deep Navy
    SECONDARY = colors.HexColor("#005B96")    # Medical Blue
    ACCENT = colors.HexColor("#338BA8")       # Cyan/Teal
    BG_LIGHT = colors.HexColor("#F8FAFC")     # Soft background
    TEXT_DARK = colors.HexColor("#1E293B")    # Slate dark text
    MUTED = colors.HexColor("#64748B")        # Muted grey text

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=MUTED,
        alignment=TA_LEFT
    )

    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=TEXT_DARK
    )

    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Italic'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=MUTED,
        alignment=TA_CENTER
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#7F1D1D"),
        alignment=TA_JUSTIFY
    )

    story = []

    # 1. Header Banner Table
    header_data = [
        [
            Paragraph("<b>OVARIAN DISEASES ANALYZER</b><br/><font size=9 color='#005B96'>AI-Assisted Ultrasound Analysis Report</font>", title_style),
            Paragraph(f"<b>Report ID:</b> RPT-{analysis.id:05d}<br/><b>Date:</b> {analysis.created_at.strftime('%Y-%m-%d %H:%M')}<br/><b>Clinician:</b> {user.name}", subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=12))

    # 2. Patient Details Table
    story.append(Paragraph("PATIENT INFORMATION", h2_style))
    patient_info_data = [
        [
            Paragraph(f"<b>Patient Name:</b> {patient.name}", body_style),
            Paragraph(f"<b>Patient ID / Code:</b> {patient.patient_code}", body_style)
        ],
        [
            Paragraph(f"<b>Age:</b> {patient.age} years", body_style),
            Paragraph(f"<b>Gender:</b> {patient.gender}", body_style)
        ]
    ]
    patient_table = Table(patient_info_data, colWidths=[270, 270])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 14))

    # 3. AI Prediction Summary Box
    story.append(Paragraph("AI CLASSIFICATION RESULT", h2_style))
    pred_display = CONDITION_DISPLAY_NAMES.get(analysis.predicted_class, analysis.predicted_class.replace('_', ' ').title())
    
    pred_summary_data = [
        [
            Paragraph("<b>Predicted Condition:</b>", body_style),
            Paragraph(f"<font size=12 color='#0F2C59'><b>{pred_display}</b></font>", body_style)
        ],
        [
            Paragraph("<b>Model Confidence Score:</b>", body_style),
            Paragraph(f"<font size=12 color='#005B96'><b>{analysis.confidence:.2f}%</b></font>", body_style)
        ]
    ]
    pred_table = Table(pred_summary_data, colWidths=[160, 380])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(pred_table)
    story.append(Spacer(1, 14))

    # 4. Probabilities Breakdown Table
    story.append(Paragraph("CLASS PROBABILITY DISTRIBUTION", h2_style))
    probs = json.loads(analysis.probabilities) if isinstance(analysis.probabilities, str) else analysis.probabilities
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        textColor=colors.white
    )
    
    prob_rows = [[
        Paragraph("Classification Category", table_header_style),
        Paragraph("Probability Score (%)", table_header_style),
        Paragraph("Relative Likelihood", table_header_style)
    ]]

    for cat_key, prob_val in probs.items():
        cat_label = CONDITION_DISPLAY_NAMES.get(cat_key, cat_key.replace('_', ' ').title())
        is_top = (cat_key == analysis.predicted_class)
        val_str = f"<b>{prob_val:.2f}%</b>" if is_top else f"{prob_val:.2f}%"
        status_markup = "<b>PRIMARY PREDICTION</b>" if is_top else "Secondary"
        
        prob_rows.append([
            Paragraph(cat_label, body_style),
            Paragraph(val_str, body_style),
            Paragraph(status_markup, body_style)
        ])

    prob_table = Table(prob_rows, colWidths=[240, 150, 150])
    prob_table_style = [
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'CENTER'),
        ('TOPPADDING', (0,1), (-1,-1), 5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 5),
    ]
    # Highlight primary row
    row_idx = 1
    for cat_key in probs.keys():
        if cat_key == analysis.predicted_class:
            prob_table_style.append(('BACKGROUND', (0, row_idx), (-1, row_idx), colors.HexColor("#FEF3C7")))
        row_idx += 1

    prob_table.setStyle(TableStyle(prob_table_style))
    story.append(prob_table)
    story.append(Spacer(1, 14))

    # 5. Image & Grad-CAM Visualizations Side-by-Side
    story.append(Paragraph("EXPLAINABLE AI VISUALIZATION (GRAD-CAM)", h2_style))
    
    # Resolve image absolute paths
    base_backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    orig_abs = os.path.join(base_backend_dir, analysis.image_path.replace("/", os.sep))
    gradcam_abs = os.path.join(base_backend_dir, analysis.gradcam_path.replace("/", os.sep))

    img_elements = []
    if os.path.exists(orig_abs) and os.path.exists(gradcam_abs):
        rl_orig = RLImage(orig_abs, width=230, height=230)
        rl_grad = RLImage(gradcam_abs, width=230, height=230)
        img_table_data = [
            [rl_orig, rl_grad],
            [
                Paragraph("Original Ultrasound Image", caption_style),
                Paragraph("Grad-CAM Feature Heatmap Overlay", caption_style)
            ]
        ]
        img_table = Table(img_table_data, colWidths=[270, 270])
        img_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        img_elements.append(img_table)
    else:
        img_elements.append(Paragraph("<i>Ultrasound visualization images unavailable</i>", caption_style))

    img_elements.append(Spacer(1, 4))
    img_elements.append(Paragraph("<i>Note: Grad-CAM highlights image regions that contributed to the model's prediction.</i>", caption_style))
    
    story.append(KeepTogether(img_elements))
    story.append(Spacer(1, 12))

    # 6. Factual AI-Assisted Analysis Summary
    story.append(Paragraph("AI-ASSISTED ANALYSIS SUMMARY", h2_style))
    summary_html = f"""
    The uploaded ultrasound image for patient <b>{patient.name}</b> (ID: {patient.patient_code}) was processed by the ResNet18 deep convolutional neural network.<br/><br/>
    The model classified the uploaded ultrasound image as <b>{pred_display}</b> with a model confidence score of <b>{analysis.confidence:.2f}%</b>.<br/><br/>
    This represents the image classification output of the AI model and should not be interpreted as a confirmed clinical finding or medical diagnosis.
    """
    story.append(Paragraph(summary_html, body_style))
    story.append(Spacer(1, 14))

    # 7. Safety Disclaimer
    disclaimer_box = [
        [
            Paragraph("<b>IMPORTANT MEDICAL DISCLAIMER</b><br/>This report contains an AI-assisted image classification result generated by a computer vision model and is intended for educational and decision-support purposes. It does not constitute a confirmed medical diagnosis or replace evaluation by a qualified gynecologist or radiologist.", disclaimer_style)
        ]
    ]
    disc_table = Table(disclaimer_box, colWidths=[540])
    disc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FCA5A5")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(KeepTogether([disc_table]))

    # Build PDF document
    doc.build(story)
    
    rel_pdf_path = f"reports/{pdf_filename}"
    return rel_pdf_path
