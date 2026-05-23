
from fastapi import APIRouter

from sqlalchemy import func

from datetime import datetime, timedelta

from app.database import SessionLocal

from app.models.ticket_model import Ticket

router = APIRouter()


@router.get("/dashboard-analytics")
def dashboard_analytics():

    db = SessionLocal()

    # =========================
    # WEEKLY DATA
    # =========================

    weekly_counts = []

    today = datetime.now()

    for i in range(6, -1, -1):

        day = today - timedelta(days=i)

        date_str = day.strftime("%Y-%m-%d")

        count = db.query(
            Ticket
        ).filter(

            Ticket.created_date.like(
                f"{date_str}%"
            )

        ).count()

        weekly_counts.append(count)

    # =========================
    # ESCALATION RISK
    # =========================

    total_tickets = db.query(
        Ticket
    ).count()

    critical_open = db.query(
        Ticket
    ).filter(

        Ticket.priority == "Critical",

        Ticket.status != "Resolved"

    ).count()

    escalation_risk = 0

    if total_tickets > 0:

        escalation_risk = int(

            (critical_open / total_tickets)
            * 100
        )

    # =========================
    # SLA HEALTH
    # =========================

    resolved = db.query(
        Ticket
    ).filter(

        Ticket.status == "Resolved"

    ).count()

    sla_health = 0

    if total_tickets > 0:

        sla_health = int(

            (resolved / total_tickets)
            * 100
        )

    # =========================
    # MOST ACTIVE DEPARTMENT
    # =========================

    dept_result = db.query(

        Ticket.department,

        func.count(
            Ticket.id
        )

    ).group_by(

        Ticket.department

    ).order_by(

        func.count(
            Ticket.id
        ).desc()

    ).first()

    most_active_dept = "N/A"

    if dept_result:

        most_active_dept = (
            dept_result[0]
        )

    db.close()

    return {

        "weeklyData":
        weekly_counts,

        "escalationRisk":
        escalation_risk,

        "slaHealth":
        sla_health,

        "mostActiveDept":
        most_active_dept
    }

