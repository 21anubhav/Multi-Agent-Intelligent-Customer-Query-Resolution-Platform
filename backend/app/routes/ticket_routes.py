
from datetime import datetime

from fastapi import APIRouter

from pydantic import BaseModel

from app.database import SessionLocal

from app.models.ticket_model import Ticket


router = APIRouter()


# =========================
# REQUEST SCHEMA
# =========================

class TicketSchema(BaseModel):

    customer: str

    department: str

    priority: str

    status: str

    summary: str


# =========================
# GET ALL TICKETS
# =========================

@router.get("/all-tickets")
def all_tickets():

    db = SessionLocal()

    tickets = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .all()
    )

    data = []

    for ticket in tickets:

        data.append({

            "id":
            ticket.id,

            "ticket_code":
            ticket.ticket_code,

            "customer":
            ticket.customer,

            "department":
            ticket.department,

            "priority":
            ticket.priority,

            "status":
            ticket.status,

            "summary":
            ticket.summary,

            "created_date":
            ticket.created_date,
        })

    db.close()

    return data


# =========================
# RECENT TICKETS
# =========================

@router.get("/recent-tickets")
def recent_tickets():

    db = SessionLocal()

    tickets = (

        db.query(Ticket)

        .order_by(
            Ticket.id.desc()
        )

        .limit(2)

        .all()
    )

    data = []

    for ticket in tickets:

        data.append({

            "id":
            ticket.id,

            "ticket_code":
            ticket.ticket_code,

            "customer":
            ticket.customer,

            "department":
            ticket.department,

            "priority":
            ticket.priority,

            "status":
            ticket.status,

            "summary":
            ticket.summary,

            "created_date":
            ticket.created_date,
        })

    db.close()

    return data


# =========================
# SEARCH TICKET
# =========================

@router.get(
    "/search-ticket/{ticket_code}"
)
def search_ticket(
    ticket_code: str
):

    db = SessionLocal()

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.ticket_code ==
            ticket_code
        )
        .first()
    )

    if not ticket:

        db.close()

        return {

            "error":
            "Ticket not found"
        }

    data = {

        "ticket_code":
        ticket.ticket_code,

        "customer":
        ticket.customer,

        "department":
        ticket.department,

        "priority":
        ticket.priority,

        "status":
        ticket.status,

        "summary":
        ticket.summary,

        "sentiment":
        getattr(
            ticket,
            "sentiment",
            "Neutral"
        ),

        "sla":
        getattr(
            ticket,
            "sla",
            "24 hours"
        ),

        "created_date":
        ticket.created_date,
    }

    db.close()

    return data


# =========================
# CREATE TICKET
# =========================

@router.post("/create-ticket")
def create_ticket(
    data: TicketSchema
):

    db = SessionLocal()

    try:

        print(
            "CREATE REQUEST:",
            data
        )

        ticket = Ticket(

            ticket_code=
            f"TICK-{int(datetime.now().timestamp())}",

            customer=
            data.customer,

            department=
            data.department,

            priority=
            data.priority,

            status=
            data.status,

            summary=
            data.summary,

            created_date=
            str(datetime.now())
        )

        db.add(ticket)

        db.commit()

        db.refresh(ticket)

        print(
            "TICKET CREATED"
        )

        return {

            "message":
            "Ticket created successfully"
        }

    except Exception as e:

        db.rollback()

        print(
            "CREATE ERROR:",
            str(e)
        )

        return {

            "error":
            str(e)
        }

    finally:

        db.close()


# =========================
# UPDATE TICKET
# =========================

@router.put(
    "/update-ticket/{ticket_id}"
)
def update_ticket(

    ticket_id: int,

    data: TicketSchema
):

    db = SessionLocal()

    try:

        ticket = (
            db.query(Ticket)
            .filter(
                Ticket.id == ticket_id
            )
            .first()
        )

        if not ticket:

            return {

                "message":
                "Ticket not found"
            }

        ticket.customer = (
            data.customer
        )

        ticket.department = (
            data.department
        )

        ticket.priority = (
            data.priority
        )

        ticket.status = (
            data.status
        )

        ticket.summary = (
            data.summary
        )

        db.commit()

        print(
            "TICKET UPDATED"
        )

        return {

            "message":
            "Ticket updated successfully"
        }

    except Exception as e:

        db.rollback()

        print(
            "UPDATE ERROR:",
            str(e)
        )

        return {

            "error":
            str(e)
        }

    finally:

        db.close()


# =========================
# DELETE TICKET
# =========================

@router.delete(
    "/delete-ticket/{ticket_id}"
)
def delete_ticket(
    ticket_id: int
):

    db = SessionLocal()

    try:

        ticket = (
            db.query(Ticket)
            .filter(
                Ticket.id == ticket_id
            )
            .first()
        )

        if not ticket:

            return {

                "message":
                "Ticket not found"
            }

        db.delete(ticket)

        db.commit()

        print(
            "TICKET DELETED"
        )

        return {

            "message":
            "Ticket deleted successfully"
        }

    except Exception as e:

        db.rollback()

        print(
            "DELETE ERROR:",
            str(e)
        )

        return {

            "error":
            str(e)
        }

    finally:

        db.close()


# =========================
# SINGLE TICKET
# =========================

@router.get(
    "/ticket/{ticket_id}"
)
def get_ticket(
    ticket_id: int
):

    db = SessionLocal()

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not ticket:

        db.close()

        return {

            "message":
            "Ticket not found"
        }

    data = {

        "id":
        ticket.id,

        "ticket_code":
        ticket.ticket_code,

        "customer":
        ticket.customer,

        "department":
        ticket.department,

        "priority":
        ticket.priority,

        "status":
        ticket.status,

        "summary":
        ticket.summary,

        "created_date":
        ticket.created_date,
    }

    db.close()

    return data

