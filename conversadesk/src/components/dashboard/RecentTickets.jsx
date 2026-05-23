import {
  useEffect,
  useState,
} from "react";

export default function RecentTickets({
  setPage,
  setNav,
}) {

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH TICKETS
  const fetchTickets = async () => {

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/recent-tickets"
      );

      const data =
        await response.json();

      setTickets(data);

    } catch (error) {

      console.log(
        "TICKET ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchTickets();

    // AUTO REFRESH
    const interval =
      setInterval(() => {

        fetchTickets();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  // PRIORITY COLORS
  const priorityColor =
    (priority) => {

      switch (priority) {

        case "Critical":
          return "#dc2626";

        case "High":
          return "#ea580c";

        case "Medium":
          return "#ca8a04";

        default:
          return "#16a34a";
      }
    };

  // STATUS COLORS
  const statusStyle =
    (status) => {

      switch (status) {

        case "Open":
          return {

            background:
              "#dbeafe",

            color:
              "#2563eb",
          };

        case "In Progress":
          return {

            background:
              "#fef3c7",

            color:
              "#ca8a04",
          };

        case "Resolved":
          return {

            background:
              "#dcfce7",

            color:
              "#16a34a",
          };

        case "Escalated":
          return {

            background:
              "#fee2e2",

            color:
              "#dc2626",
          };

        default:
          return {

            background:
              "#e2e8f0",

            color:
              "#475569",
          };
      }
    };

  return (

    <div
      style={{
        marginTop: "30px",

        background: "#ffffff",

        borderRadius: "20px",

        border:
          "1px solid #e2e8f0",

        overflow: "hidden",

        boxShadow:
          "0 4px 18px rgba(0,0,0,0.04)",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "24px",

          borderBottom:
            "1px solid #e2e8f0",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",
        }}
      >

        <div>

          <h2
            style={{
              fontSize: "20px",

              fontWeight: "700",

              color: "#1e293b",
            }}
          >
            Recent Tickets
          </h2>

          <p
            style={{
              marginTop: "6px",

              fontSize: "14px",

              color: "#64748b",
            }}
          >
            Live enterprise support activities
          </p>

        </div>

        {/* VIEW ALL BUTTON */}
        <button

          onClick={() => {

            if (setNav) {

              setNav("tickets");
            }

            if (setPage) {

              setPage("tickets");
            }

          }}

          style={{
            padding:
              "10px 18px",

            borderRadius:
              "12px",

            border: "none",

            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",

            color: "white",

            cursor: "pointer",

            fontWeight: "600",

            boxShadow:
              "0 4px 14px rgba(99,102,241,0.3)",
          }}
        >
          View All
        </button>

      </div>

      {/* TABLE */}
      <div
        style={{
          overflowX: "auto",
        }}
      >

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            minWidth: "900px",
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  "#f8fafc",
              }}
            >

              {[
                "Ticket ID",
                "Customer",
                "Department",
                "Priority",
                "Status",
              ].map((heading) => (

                <th
                  key={heading}

                  style={{
                    textAlign:
                      "left",

                    padding:
                      "18px 24px",

                    fontSize:
                      "13px",

                    color:
                      "#64748b",

                    fontWeight:
                      "700",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {heading}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"

                  style={{
                    padding:
                      "30px",

                    textAlign:
                      "center",

                    color:
                      "#64748b",
                  }}
                >
                  Loading tickets...
                </td>

              </tr>

            ) : tickets.length === 0 ? (

              <tr>

                <td
                  colSpan="5"

                  style={{
                    padding:
                      "30px",

                    textAlign:
                      "center",

                    color:
                      "#64748b",
                  }}
                >
                  No tickets found
                </td>

              </tr>

            ) : (

              tickets.map(
                (ticket, index) => (

                  <tr
                    key={index}

                    style={{
                      borderTop:
                        "1px solid #f1f5f9",

                      transition:
                        "0.2s",
                    }}

                    onMouseEnter={(e) => {

                      e.currentTarget.style.background =
                        "#f8fafc";

                    }}

                    onMouseLeave={(e) => {

                      e.currentTarget.style.background =
                        "#ffffff";

                    }}
                  >

                    {/* ID */}
                    <td
                      style={{
                        padding:
                          "20px 24px",

                        fontWeight:
                          "700",

                        color:
                          "#6366f1",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        ticket.ticket_code
                      }
                    </td>

                    {/* CUSTOMER */}
                    <td
                      style={{
                        padding:
                          "20px 24px",

                        color:
                          "#1e293b",

                        fontWeight:
                          "500",
                      }}
                    >
                      {
                        ticket.customer
                      }
                    </td>

                    {/* DEPARTMENT */}
                    <td
                      style={{
                        padding:
                          "20px 24px",

                        color:
                          "#64748b",
                      }}
                    >
                      {
                        ticket.department
                      }
                    </td>

                    {/* PRIORITY */}
                    <td
                      style={{
                        padding:
                          "20px 24px",

                        fontWeight:
                          "700",

                        color:
                          priorityColor(
                            ticket.priority
                          ),
                      }}
                    >
                      {
                        ticket.priority
                      }
                    </td>

                    {/* STATUS */}
                    <td
                      style={{
                        padding:
                          "20px 24px",
                      }}
                    >

                      <span
                        style={{
                          padding:
                            "8px 14px",

                          borderRadius:
                            "999px",

                          fontSize:
                            "12px",

                          fontWeight:
                            "700",

                          whiteSpace:
                            "nowrap",

                          ...statusStyle(
                            ticket.status
                          ),
                        }}
                      >
                        {
                          ticket.status
                        }
                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}