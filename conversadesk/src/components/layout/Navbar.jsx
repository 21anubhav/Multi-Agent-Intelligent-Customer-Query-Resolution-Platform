import {
  useEffect,
  useState,
  useRef,
} from "react";

export default function Navbar({
  sideOpen,
  setSideOpen,
  role,
  onLogout,
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const notificationRef =
    useRef(null);

  const [notifications,
  setNotifications] =
    useState([]);

  const [unreadCount,
  setUnreadCount] =
    useState(

      Number(

        localStorage.getItem(
          "unreadTickets"
        )

      ) || 0
    );

  const [showNotifications,
  setShowNotifications] =
    useState(false);

  const [search,
  setSearch] =
    useState("");

  const [ticket,
  setTicket] =
    useState(null);

  const [loading,
  setLoading] =
    useState(false);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  useEffect(() => {

    fetchNotifications();

    const interval =
      setInterval(() => {

        fetchNotifications();

      }, 20000);

    return () =>
      clearInterval(interval);

  }, []);

  const fetchNotifications =
    async () => {

      try {

        const response =
          await fetch(

            "http://127.0.0.1:8000/recent-tickets"
          );

        const data =
          await response.json();

        // latest 2 only
        const latestTickets =
          data.slice(0, 2);

        setNotifications(
          latestTickets
        );

        // already seen tickets
        const seenIds =
          JSON.parse(

            localStorage.getItem(
              "seenTickets"
            )

          ) || [];

        // unseen tickets
        const unseen =
          latestTickets.filter(

            (ticket) =>

              !seenIds.includes(
                ticket.id
              )
          );

        setUnreadCount(
          unseen.length
        );

        localStorage.setItem(

          "unreadTickets",

          unseen.length
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // CLOSE DROPDOWN
  // =========================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (

          notificationRef.current &&

          !notificationRef.current.contains(
            event.target
          )

        ) {

          setShowNotifications(
            false
          );
        }
      };

    document.addEventListener(

      "mousedown",

      handleClickOutside
    );

    return () => {

      document.removeEventListener(

        "mousedown",

        handleClickOutside
      );
    };

  }, []);

  // =========================
  // SEARCH TICKET
  // =========================

  const handleSearch =
    async (e) => {

      if (e.key !== "Enter")
        return;

      if (!search.trim())
        return;

      try {

        setLoading(true);

        const response =
          await fetch(

            `http://127.0.0.1:8000/search-ticket/${search.trim()}`
          );

        const data =
          await response.json();

        if (
          data.error ||
          !data.ticket_code
        ) {

          alert(
            "Ticket not found"
          );

          setLoading(false);

          return;
        }

        setTicket(data);

        setSearch("");

      } catch (error) {

        console.log(error);

        alert(
          "Search failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <>
      <header
        style={{
          height: "70px",
          background: "#ffffff",
          borderBottom:
            "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          padding: "0 24px",
          position: "relative",
          zIndex: 20,
        }}
      >

        {/* LEFT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >

          <button
            onClick={() =>
              setSideOpen(!sideOpen)
            }
            style={{
              border: "none",
              background: "#f1f5f9",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ☰
          </button>

          <div>

            <h2
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              ConversaDesk AI
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0,
              }}
            >
              Enterprise Ticket Intelligence
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >

          {/* SEARCH */}
          <div
            style={{
              position: "relative",
            }}
          >

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={handleSearch}
              placeholder="Search ticket by ID..."
              style={{
                width: "280px",
                padding:
                  "11px 16px",
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0",
                outline: "none",
                background: "#f8fafc",
                fontSize: "14px",
              }}
            />

            {
              loading && (

                <div
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "12px",
                    fontSize: "12px",
                    color: "#6366f1",
                    fontWeight: "600",
                  }}
                >
                  Searching...
                </div>

              )
            }

          </div>

          {/* NOTIFICATIONS */}
          <div
            ref={notificationRef}
            style={{
              position: "relative",
            }}
          >

            <button
              onClick={() => {

                const nextState =
                  !showNotifications;

                setShowNotifications(
                  nextState
                );

                // mark notifications as seen
                if (nextState) {

                  const ids =
                    notifications.map(
                      (ticket) => ticket.id
                    );

                  localStorage.setItem(

                    "seenTickets",

                    JSON.stringify(ids)
                  );

                  localStorage.setItem(
                    "unreadTickets",
                    0
                  );

                  setUnreadCount(0);
                }

              }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0",
                background: "#ffffff",
                cursor: "pointer",
                fontSize: "18px",
                position: "relative",
              }}
            >
              🔔

              {
                unreadCount > 0 && (

                  <div
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      fontWeight: "700",
                    }}
                  >
                    {unreadCount}
                  </div>

                )
              }

            </button>

            {/* DROPDOWN */}
            {
              showNotifications && (

                <div
                  style={{
                    position: "absolute",
                    top: "54px",
                    right: 0,
                    width: "360px",
                    maxHeight: "420px",
                    overflowY: "auto",
                    background:
                      "#ffffff",
                    borderRadius:
                      "18px",
                    border:
                      "1px solid #e2e8f0",
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.08)",
                    padding: "18px",
                    zIndex: 50,
                  }}
                >

                  <h3
                    style={{
                      marginBottom: "18px",
                      color: "#0f172a",
                    }}
                  >
                    Latest Enterprise Tickets
                  </h3>

                  {
                    notifications
                      .length === 0 ? (

                        <p
                          style={{
                            color:
                              "#64748b",
                          }}
                        >
                          No notifications
                        </p>

                      ) : (

                        notifications.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}
                              style={{
                                padding:
                                  "14px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#f8fafc",
                                marginBottom:
                                  "12px",
                                border:
                                  "1px solid #e2e8f0",
                              }}
                            >

                              <p
                                style={{
                                  margin: 0,
                                  fontWeight:
                                    "700",
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  item.ticket_code
                                }
                              </p>

                              <p
                                style={{
                                  margin:
                                    "8px 0",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    "1.5",
                                }}
                              >
                                {
                                  item.summary
                                }
                              </p>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                }}
                              >

                                <span
                                  style={{
                                    fontSize:
                                      "12px",
                                    color:
                                      "#6366f1",
                                    fontWeight:
                                      "600",
                                  }}
                                >
                                  {
                                    item.priority
                                  } Priority
                                </span>

                                <span
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#94a3b8",
                                  }}
                                >
                                  {
                                    item.department
                                  }
                                </span>

                              </div>

                            </div>

                          )
                        )

                      )
                  }

                </div>

              )
            }

          </div>

          {/* USER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "#f8fafc",
              padding: "8px 12px",
              borderRadius: "12px",
            }}
          >

            {/* AVATAR */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontWeight: "700",
              }}
            >
              {
                role === "manager"
                  ? "MG"
                  : "EM"
              }
            </div>

            {/* INFO */}
            <div>

              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                {
                  user?.name ||
                  "User"
                }
              </p>

              <p
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: 0,
                  textTransform:
                    "capitalize",
                }}
              >
                {role}
              </p>

            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {

                localStorage.removeItem(
                  "user"
                );

                window.location.reload();

              }}
              style={{
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
                padding:
                  "8px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* SEARCH RESULT MODAL */}
      {
        ticket && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              zIndex: 100,
            }}
          >

            <div
              style={{
                width: "520px",
                background:
                  "#ffffff",
                borderRadius: "24px",
                padding: "30px",
                boxShadow:
                  "0 25px 50px rgba(0,0,0,0.15)",
              }}
            >

              <h2
                style={{
                  marginBottom: "24px",
                  color: "#0f172a",
                }}
              >
                Ticket Details
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "16px",
                }}
              >

                <p>
                  <b>Ticket:</b>{" "}
                  {
                    ticket.ticket_code
                  }
                </p>

                <p>
                  <b>Customer:</b>{" "}
                  {ticket.customer}
                </p>

                <p>
                  <b>Department:</b>{" "}
                  {
                    ticket.department
                  }
                </p>

                <p>
                  <b>Status:</b>{" "}
                  {ticket.status}
                </p>

                <p>
                  <b>Priority:</b>{" "}
                  {ticket.priority}
                </p>

                <p>
                  <b>Summary:</b>{" "}
                  {ticket.summary}
                </p>

                <p>
                  <b>SLA:</b>{" "}
                  {ticket.sla}
                </p>

                <p>
                  <b>Sentiment:</b>{" "}
                  {
                    ticket.sentiment
                  }
                </p>

              </div>

              <button
                onClick={() =>
                  setTicket(null)
                }
                style={{
                  marginTop: "28px",
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius:
                    "14px",
                  background:
                    "#6366f1",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Close
              </button>

            </div>

          </div>

        )
      }

    </>
  );
}