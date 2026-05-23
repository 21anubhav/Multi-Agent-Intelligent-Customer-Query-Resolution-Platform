import json

from datetime import datetime

from app.database import SessionLocal

from app.models.email_model import EmailRecord

from app.models.ticket_model import Ticket

from app.services.azure_ai_service import (

    analyze_email,

    generate_email_reply
)

from app.services.rag_service import (
    search_rag
)

from app.services.gmail_send_service import (
    send_gmail
)


# =========================================
# NORMALIZE DEPARTMENT
# =========================================

def normalize_department(department):

    if not department:

        return "Others"

    department = (
        department
        .strip()
        .lower()
    )

    department_map = {

        # BILLING
        "billing":
        "Billing",

        "invoice":
        "Billing",

        "refund":
        "Billing",

        # FINANCE
        "finance":
        "Finance",

        "accounts":
        "Finance",

        "payroll":
        "Finance",

        # HR
        "hr":
        "Human Resources",

        "human resources":
        "Human Resources",

        "leave":
        "Human Resources",

        "employee":
        "Human Resources",

        # IT
        "it":
        "IT Support",

        "technical":
        "IT Support",

        "system":
        "IT Support",

        "access":
        "IT Support",

        # OPERATIONS
        "operations":
        "Operations",

        "workflow":
        "Operations",

        # CUSTOMER SERVICE
        "customer service":
        "Customer Service",

        "customer support":
        "Customer Service",

        "support":
        "Customer Service",

        # SALES
        "sales":
        "Sales",

        # LEGAL
        "legal":
        "Legal",

        "compliance":
        "Legal",

        # PROCUREMENT
        "procurement":
        "Procurement",

        "vendor":
        "Procurement",

        "purchase":
        "Procurement",

        # ADMIN
        "administration":
        "Administration",

        "admin":
        "Administration",
    }

    return department_map.get(

        department,

        "Others"
    )


# =========================================
# PROCESS EMAILS
# =========================================

def process_emails():

    db = SessionLocal()

    emails = db.query(
        EmailRecord
    ).filter(

        EmailRecord.status == "New"

    ).all()

    for email in emails:

        print(
            "PROCESSING:",
            email.subject
        )

        # =========================================
        # AI ANALYSIS
        # =========================================

        ai_response = analyze_email(

            email.subject,

            email.body
        )

        try:

            analysis = json.loads(
                ai_response
            )

        except Exception:

            analysis = {

                "department":
                "Others",

                "priority":
                "Medium",

                "sentiment":
                "Neutral",

                "summary":
                email.subject,

                "issue_type":
                "General"
            }

        # =========================================
        # NORMALIZE DEPARTMENT
        # =========================================

        normalized_department = normalize_department(

            analysis.get(
                "department",
                "Others"
            )
        )

        print(
            "NORMALIZED DEPARTMENT:",
            normalized_department
        )

        # =========================================
        # RAG SEARCH
        # =========================================

        rag_results = search_rag(

            email.subject
            + " "
            + email.body
        )

        rag_context = ""

        if rag_results:

            rag_context = (
                rag_results[0].page_content
            )

        # =========================================
        # GENERATE AI REPLY
        # =========================================

        reply = generate_email_reply(

            email.body,

            rag_context
        )

        # =========================================
        # SEND EMAIL
        # =========================================

        send_gmail(

            email.sender,

            "Re: " + email.subject,

            reply
        )

        print(
            "AUTO REPLY SENT"
        )

        # =========================================
        # CREATE TICKET
        # =========================================

        ticket = Ticket(

            ticket_code=
            f"TICK-{email.id}",

            customer=email.sender,

            department=
            normalized_department,

            priority=
            analysis.get(
                "priority",
                "Medium"
            ),

            status="Open",

            sentiment=
            analysis.get(
                "sentiment",
                "Neutral"
            ),

            description=email.body,

            summary=
            analysis.get(
                "summary",
                email.subject
            ),

            created_date=
            str(datetime.now()),

            sla=24,

            created_by=1
        )

        db.add(ticket)

        print(
            "TICKET CREATED"
        )

        email.ticket_created = "Yes"

        email.status = "Processed"

    db.commit()

    db.close()

    return {

        "message":
        "AI processing completed"
    }