"""Generate docs/CareGap-FI-brief.pdf — cold-reader 2-page brief.

Palette and hierarchy follow DESIGN.md / app/globals.css.
Content source: docs/CareGap-FI-brief.md (keep in sync when editing claims).
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "CareGap-FI-brief.pdf"

# Match DESIGN.md / app/globals.css (print uses paper-raised as page white).
INK = HexColor("#0e1a24")
INK_SOFT = HexColor("#3d4f5c")
INK_FAINT = HexColor("#6b7c8a")
PAPER_SOFT = HexColor("#f3f6f8")
RULE = HexColor("#c9d3db")
ACCENT = HexColor("#1f6f66")
ACCENT_SOFT = HexColor("#e4f0ee")
ALARM = HexColor("#9b2f1e")
ALARM_SOFT = HexColor("#f7e8e4")

# Arial covers Czech diacritics (praktický lékař); Helvetica does not.
pdfmetrics.registerFont(TTFont("Brief", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("Brief-Bold", r"C:\Windows\Fonts\arialbd.ttf"))
FONT = "Brief"
FONT_BOLD = "Brief-Bold"


def styles():
    base = getSampleStyleSheet()
    return {
        "eyebrow": ParagraphStyle(
            "eyebrow",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            textColor=ACCENT,
            tracking=1.2,
            spaceAfter=4,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=22,
            leading=26,
            textColor=INK,
            spaceAfter=2,
        ),
        "tagline": ParagraphStyle(
            "tagline",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=11,
            leading=15,
            textColor=INK_SOFT,
            spaceAfter=6,
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=8,
            leading=11,
            textColor=INK_FAINT,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=11,
            leading=14,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=9.5,
            leading=12.5,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=9.5,
            leading=13,
            textColor=INK,
            leftIndent=10,
            bulletIndent=0,
            spaceAfter=3,
        ),
        "cell": ParagraphStyle(
            "cell",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=8.5,
            leading=11,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "cell_head": ParagraphStyle(
            "cell_head",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=10,
            textColor=INK,
        ),
        "chip": ParagraphStyle(
            "chip",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=7,
            textColor=ACCENT,
        ),
        "foot": ParagraphStyle(
            "foot",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=7.5,
            leading=10,
            textColor=INK_FAINT,
            spaceBefore=6,
        ),
        "cite": ParagraphStyle(
            "cite",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=7.5,
            leading=10,
            textColor=INK_FAINT,
            spaceBefore=2,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=9,
            leading=12,
            textColor=INK,
        ),
    }


def build():
    s = styles()
    story = []

    story.append(Paragraph("JUNCTION 2026  ·  TEAM NOTOKENS  ·  COLD-READER BRIEF", s["eyebrow"]))
    story.append(Paragraph("CareGap FI", s["title"]))
    story.append(Paragraph("A ready-made pilot for one wellbeing services county", s["tagline"]))
    story.append(
        Paragraph(
            "For a mentor, judge, or teammate who has never heard of this project.",
            s["meta"],
        )
    )
    story.append(HRFlowable(width="100%", thickness=1, color=RULE, spaceAfter=6))

    # What / who
    story.append(Paragraph("What this is", s["h2"]))
    story.append(
        Paragraph(
            "CareGap FI is a planning prototype that helps a Finnish wellbeing services county "
            "(<i>hyvinvointialue</i>) decide whether to run a measured experiment: let primary care "
            "refer selected patients straight to chest CT, and publish the pathway clock that "
            "Finland still does not report nationally.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "It is not an AI diagnosis tool, not a patient chatbot, and not a medical device.",
            s["body"],
        )
    )

    story.append(Paragraph("Who it is for", s["h2"]))
    story.append(
        Paragraph(
            "Wellbeing services county pathway leads and FICAN planners who must choose whether "
            "to copy (or refuse) a Satakunta-style direct primary-care CT pathway this year.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "Czech parallel for orientation: a <i>praktický lékař</i> generally cannot send a "
            "patient straight to CT. The Finnish primary-care doctor faces the same gate.",
            s["body"],
        )
    )

    # Problem callout box
    story.append(Paragraph("The problem", s["h2"]))
    callout_inner = [
        [
            Paragraph(
                "<b>Nordic survival gap.</b> Lung cancer, men, 5-year age-standardised relative "
                "survival (diagnosed 2020–2024): Finland <font color='#9b2f1e'><b>17.9%</b></font> "
                "(95% CI 16.7–19.2) vs Sweden <b>31.3%</b> (30.0–32.7). Finland last in the Nordics; "
                "intervals do not overlap. "
                "<font color='#1f6f66'><b>Sourced · NORDCAN C33–C34</b></font>",
                s["callout"],
            )
        ]
    ]
    callout = Table(callout_inner, colWidths=[170 * mm])
    callout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ALARM_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#e8c4bc")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(callout)
    story.append(Spacer(1, 5))

    story.append(
        Paragraph(
            "<b>Primary-care CT access.</b> In Finland, a health-centre doctor can usually order a "
            "chest X-ray, but CT typically waits for a specialist referral. Peer Nordic pathways "
            "build primary-care or filter CT into the route by design. "
            "<font color='#1f6f66'><b>Sourced · Acta Oncol 2025 · JTO 2024 · EU-JUST-CT · "
            "SVF / pakkeforløb / filterfunksjon</b></font>",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "<b>What peers publish vs Finland.</b> Sweden, Denmark and Norway publish cancer-specific "
            "<b>pathway clocks</b> (share of lung pathways meeting day targets to first treatment, "
            "often by region or hospital). Finland publishes registration outcomes and a lung "
            "quality-registry <i>pilot</i> (stage completeness, treatment mix). A county manager "
            "still cannot open “days from GP referral to CT report.” Missing clocks is not the "
            "same as “no register.” "
            "<font color='#1f6f66'><b>Sourced · REGISTER_COMPARE / NLCR · SST · Helsedirektoratet · "
            "FCR/FICAN</b></font>",
            s["body"],
        )
    )

    # Product
    story.append(Paragraph("What the product is", s["h2"]))
    story.append(
        Paragraph(
            "A county experiment package. We are not asserting that Satakunta already works.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The pathway piece copies Satakunta-style direct primary-care chest CT for selected "
            "high-risk symptomatic patients. Local press describes about 170 patients and an "
            "impact study as ongoing; there is no peer-reviewed evaluation yet. "
            "<font color='#1f6f66'><b>Sourced · Satakunnan Kansa 2025</b></font>",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The measurement piece pre-registers a process endpoint a county can collect: time from "
            "primary-care CT order to CT report.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The stop rule is hard: if expected demand exceeds CT and reporting capacity, do not "
            "announce the pathway. Shipping a longer queue counts as failure.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The demo is an install wizard for that package (capacity check, equity notes, Monday "
            "brief, and an Evidence Void that refuses to invent national clocks Finland does not publish).",
            s["body"],
        )
    )

    # Success table
    story.append(Paragraph("What success looks like", s["h2"]))
    header = [
        Paragraph("Claim type", s["cell_head"]),
        Paragraph("Definition", s["cell_head"]),
    ]
    rows = [
        header,
        [
            Paragraph("Process success", s["cell"]),
            Paragraph(
                "Median (or agreed percentile) ≤ <b>10 calendar days</b> from primary-care CT "
                "order to CT report, for the pilot cohort. "
                "<font color='#1f6f66'><b>Estimate · pilot design target</b></font>",
                s["cell"],
            ),
        ],
        [
            Paragraph("Operational stop", s["cell"]),
            Paragraph(
                "Rollout blocked when projected demand &gt; available CT slots + reporting capacity.",
                s["cell"],
            ),
        ],
        [
            Paragraph("Learning success", s["cell"]),
            Paragraph(
                "Comparator logged; stop-rule decisions documented; numbers labelled "
                "Sourced / Estimate / Unknown.",
                s["cell"],
            ),
        ],
    ]
    table = Table(rows, colWidths=[38 * mm, 132 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PAPER_SOFT),
                ("BACKGROUND", (0, 1), (-1, 1), ACCENT_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.5, RULE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(table)
    story.append(
        Paragraph(
            "Ten days sits near Swedish SVF filter design times (5 days imaging + 1 day answer) "
            "with room for local reporting. It is not a national Finnish standard.",
            s["cite"],
        )
    )

    # Do not claim
    story.append(Paragraph("What we do not claim", s["h2"]))
    story.append(
        Paragraph(
            "We do not claim the pilot will move Finland’s stage mix, and we do not print "
            "“lives saved.” Satakunta press coverage is not an outcome study.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The only cluster-RCT of GP direct chest CT (Denmark, Guldbrandt et al. 2015) found "
            "no significant effect on stage or diagnostic interval. That is why we sell a measured "
            "rollout rather than a cure story. "
            "<font color='#1f6f66'><b>Sourced · BMC Cancer 2015</b></font>",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "We also refuse the “Finland ~17% stage I” line. That figure is a selected "
            "university-hospital NSCLC subsample with recorded stage (Leskelä 2022), not a clean "
            "national stage I share. Do not mash it against DK/NO registry rates.",
            s["body"],
        )
    )

    # Disclaimer
    story.append(Paragraph("Prototype disclaimer", s["h2"]))
    disc = Table(
        [
            [
                Paragraph(
                    "Hackathon prototype for population-level pathway planning and education. "
                    "Aggregate public data only. <b>Not a medical device.</b> Does not assess, "
                    "diagnose, or triage any individual. Does not recommend medicines. Every "
                    "figure is labelled <b>Sourced</b>, <b>Estimate</b>, or <b>Unknown</b>.",
                    s["callout"],
                )
            ]
        ],
        colWidths=[170 * mm],
    )
    disc.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PAPER_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.5, RULE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(KeepTogether([disc]))

    story.append(
        Paragraph(
            "Light citations: NORDCAN · Acta Oncologica 2025 · JTO 2024 · EU-JUST-CT · "
            "REGISTER_COMPARE (SE NLCR/SVF, DK SST/DLCR, NO Helsedirektoratet, FI FCR/FICAN) · "
            "Satakunnan Kansa 2025 · Guldbrandt et al. 2015 · Leskelä et al. 2022",
            s["cite"],
        )
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="CareGap FI — cold-reader brief",
        author="NoTokens · Junction 2026",
        subject="Measured primary-care CT pilot for one wellbeing services county",
    )

    def _footer(canvas, doc_):
        canvas.saveState()
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        y = 10 * mm
        canvas.line(18 * mm, y + 4 * mm, A4[0] - 18 * mm, y + 4 * mm)
        canvas.setFont(FONT, 7)
        canvas.setFillColor(INK_FAINT)
        canvas.drawString(18 * mm, y, "CareGap FI  ·  Junction 2026  ·  Prototype, not a medical device")
        canvas.drawRightString(A4[0] - 18 * mm, y, f"{doc_.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
