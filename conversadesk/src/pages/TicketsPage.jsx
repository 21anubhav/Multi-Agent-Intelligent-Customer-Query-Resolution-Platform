import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/layout/sidebar";

import Navbar from "../components/layout/Navbar";

export default function TicketsPage({
  role,
  setPage,
  onLogout,
}) {

  const [sideOpen, setSideOpen] =
    useState(true);

  const [nav, setNav] =
    useState("tickets");

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedTicket,
  setSelectedTicket] =
    useState(null);

  const [showModal,
  setShowModal] =
    useState(false);

  const [showCreateModal,
  setShowCreateModal] =
    useState(false);

  const [editMode,
  setEditMode] =
    useState(false);

  const [formData,
  setFormData] =
    useState({

      customer: "",

      department: "",

      priority: "Medium",

      status: "Open",

      summary: "",
    });

  const inputStyle = {

    padding: "14px",

    borderRadius: "14px",

    border: "1px solid #e2e8f0",

    outline: "none",

    fontSize: "14px",

    background: "#f8fafc",
  };

  // FETCH TICKETS
  const fetchTickets = async () => {

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/all-tickets"
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

  // DELETE TICKET
  const deleteTicket =
    async (ticketId) => {

      const confirmDelete =
        window.confirm(
          "Delete this ticket?"
        );

      if (!confirmDelete) return;

      try {

        await fetch(

          `http://127.0.0.1:8000/delete-ticket/${ticketId}`,

          {
            method: "DELETE",
          }
        );

        fetchTickets();

      } catch (error) {

        console.log(error);
      }
    };

  // SAVE TICKET
  const saveTicket =
    async () => {

      try {

        // UPDATE
        if (editMode) {

          await fetch(

            `http://127.0.0.1:8000/update-ticket/${selectedTicket.id}`,

            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                formData
              ),
            }
          );

        }

        // CREATE
        else {

          await fetch(

            "http://127.0.0.1:8000/create-ticket",

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                formData
              ),
            }
          );
        }

        setShowCreateModal(false);

        fetchTickets();

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchTickets();

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

  // STATUS STYLE
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

        case "Closed":
          return {

            background:
              "#e2e8f0",

            color:
              "#475569",
          };

        default:
          return {

            background:
              "#fee2e2",

            color:
              "#dc2626",
          };
      }
    };

  // SEARCH FILTER
  const filteredTickets =
    tickets.filter((ticket) => {

      const value =
        search.toLowerCase();

      return (

        ticket.ticket_code
          ?.toLowerCase()
          .includes(value)

        ||

        ticket.customer
          ?.toLowerCase()
          .includes(value)

        ||

        ticket.department
          ?.toLowerCase()
          .includes(value)

        ||

        ticket.status
          ?.toLowerCase()
          .includes(value)
      );
    });

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
      }}
    >

      {/* SIDEBAR */}
      <Sidebar
        sideOpen={sideOpen}
        setSideOpen={setSideOpen}
        nav={nav}
        setNav={setNav}
        role={role}
        setPage={setPage}
      />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* NAVBAR */}
        <Navbar
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          role={role}
          onLogout={onLogout}
        />

        {/* CONTENT */}
        <div
          style={{
            flex: 1, 
            padding: "30px", 
            overflowY: "auto", 
            height: "100%",
          }}
        >

          {/* HEADER */}
          <div
            style={{
              marginBottom: "30px",
            }}
          >

            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Ticket Management
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Manage and monitor
              enterprise support tickets
            </p>

          </div>

          {/* TABLE CARD */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "22px",
              border:
                "1px solid #e2e8f0",
              overflow: "auto",
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.04)",
            }}
          >

            {/* TOP */}
            <div
              style={{
                padding: "24px",
                borderBottom:
                  "1px solid #e2e8f0",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >

              <div>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  All Tickets
                </h2>

                <p
                  style={{
                    marginTop: "6px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Live enterprise
                  ticket database
                </p>

              </div>

              {/* RIGHT */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >

                {/* SEARCH */}
                <input
                  value={search}

                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }

                  placeholder="Search tickets..."

                  style={{
                    padding:
                      "12px 16px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #e2e8f0",
                    outline: "none",
                    width: "260px",
                    background:
                      "#f8fafc",
                  }}
                />

                {/* BUTTON */}
                <button
                  onClick={() => {

                    setFormData({

                      customer: "",

                      department: "",

                      priority: "Medium",

                      status: "Open",

                      summary: "",
                    });

                    setEditMode(false);

                    setShowCreateModal(true);
                  }}

                  style={{
                    padding:
                      "12px 18px",
                    borderRadius:
                      "12px",
                    border: "none",
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow:
                      "0 4px 14px rgba(99,102,241,0.3)",
                  }}
                >
                  + Create Ticket
                </button>

              </div>

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
                  minWidth: "1100px",
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
                      "Created Date",
                      "Actions",
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
                        colSpan="7"
                        style={{
                          padding:
                            "40px",
                          textAlign:
                            "center",
                        }}
                      >
                        Loading tickets...
                      </td>

                    </tr>

                  ) : filteredTickets.map(

                    (ticket, index) => (

                      <tr
                        key={index}

                        style={{
                          borderTop:
                            "1px solid #f1f5f9",
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
                          }}
                        >
                          {
                            ticket.customer
                          }
                        </td>

                        {/* DEPT */}
                        <td
                          style={{
                            padding:
                              "20px 24px",
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
                            color:
                              priorityColor(
                                ticket.priority
                              ),
                            fontWeight:
                              "700",
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

                        {/* DATE */}
                        <td
                          style={{
                            padding:
                              "20px 24px",
                          }}
                        >
                          {
                            ticket.created_date
                          }
                        </td>

                        {/* ACTIONS */}
                        <td
                          style={{
                            padding:
                              "20px 24px",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "10px",
                            }}
                          >

                            {/* VIEW */}
                            <button
                              onClick={() => {

                                setSelectedTicket(
                                  ticket
                                );

                                setFormData({

                                  customer:
                                    ticket.customer,

                                  department:
                                    ticket.department,

                                  priority:
                                    ticket.priority,

                                  status:
                                    ticket.status,

                                  summary:
                                    ticket.summary || "",
                                });

                                setEditMode(true);

                                setShowCreateModal(true);
                              }}

                              style={{
                                padding:
                                  "10px 14px",
                                borderRadius:
                                  "10px",
                                border:
                                  "none",
                                background:
                                  "#ede9fe",
                                color:
                                  "#6366f1",
                                fontWeight:
                                  "700",
                                cursor:
                                  "pointer",
                              }}
                            >
                              View
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                deleteTicket(
                                  ticket.id
                                )
                              }

                              style={{
                                padding:
                                  "10px 14px",
                                borderRadius:
                                  "10px",
                                border:
                                  "none",
                                background:
                                  "#fee2e2",
                                color:
                                  "#dc2626",
                                fontWeight:
                                  "700",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {/* CREATE / UPDATE MODAL */}
      {showCreateModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >

          <div
            style={{
              width: "650px",
              background: "white",
              borderRadius: "24px",
              padding: "34px",
            }}
          >

            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                {editMode
                  ? "Update Ticket"
                  : "Create Ticket"}
              </h2>

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }

                style={{
                  border: "none",
                  background: "#f1f5f9",
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

            </div>

            {/* FORM */}
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "18px",
              }}
            >

              <input
                placeholder="Customer"

                value={formData.customer}

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    customer:
                      e.target.value,
                  })
                }

                style={inputStyle}
              />

              <input
                placeholder="Department"

                value={formData.department}

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    department:
                      e.target.value,
                  })
                }

                style={inputStyle}
              />

              <select
                value={formData.priority}

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    priority:
                      e.target.value,
                  })
                }

                style={inputStyle}
              >
                <option>
                  Low
                </option>

                <option>
                  Medium
                </option>

                <option>
                  High
                </option>

                <option>
                  Critical
                </option>
              </select>

              <select
                value={formData.status}

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    status:
                      e.target.value,
                  })
                }

                style={inputStyle}
              >
                <option>
                  Open
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Resolved
                </option>

                <option>
                  Closed
                </option>
              </select>

              <textarea
                rows={5}

                placeholder="Summary"

                value={formData.summary}

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    summary:
                      e.target.value,
                  })
                }

                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />

              <button
                onClick={saveTicket}

                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "white",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {editMode
                  ? "Update Ticket"
                  : "Create Ticket"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}