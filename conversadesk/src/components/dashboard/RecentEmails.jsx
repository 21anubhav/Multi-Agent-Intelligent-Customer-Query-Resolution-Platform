import { useEffect, useState } from "react";

export default function RecentEmails() {

  const [emails, setEmails] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedEmail,
    setSelectedEmail] =
    useState(null);

  const fetchEmails = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/all-emails"
      );

      const data =
        await response.json();

      setEmails(data);

      // AUTO SELECT FIRST MAIL
      if (
        data.length > 0 &&
        !selectedEmail
      ) {
        setSelectedEmail(data[0]);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchEmails();

    const interval = setInterval(() => {

      fetchEmails();

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div
      style={{
        display: "flex",
        gap: "24px",
        marginTop: "30px",
        height: "85vh",
      }}
    >

      {/* LEFT MAIL LIST */}
      <div
        style={{
          width: "32%",
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* HEADER */}
        <div
          style={{
            padding: "24px",
            borderBottom:
              "1px solid #e2e8f0",
          }}
        >

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            Enterprise Inbox
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            AI monitored customer emails
          </p>

        </div>

        {/* MAIL LIST */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >

          {loading && (

            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#64748b",
              }}
            >
              Loading emails...
            </div>

          )}

          {!loading && emails.map(

            (email, index) => (

            <div
              key={index}

              onClick={() =>
                setSelectedEmail(email)
              }

              style={{
                padding: "18px",
                borderRadius: "18px",

                marginBottom: "14px",

                cursor: "pointer",

                border:

                  selectedEmail?.id
                  === email.id

                    ? "2px solid #6366f1"

                    : "1px solid #e2e8f0",

                background:

                  selectedEmail?.id
                  === email.id

                    ? "#eef2ff"

                    : "#ffffff",

                transition: "0.2s",
              }}
            >

              {/* SUBJECT */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "6px",
                }}
              >
                {email.subject}
              </h3>

              {/* SENDER */}
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "10px",
                }}
              >
                {email.sender}
              </p>

              {/* PREVIEW */}
              <p
                style={{
                  fontSize: "13px",
                  color: "#475569",
                  lineHeight: "1.7",
                }}
              >
                {
                  email.body
                  ?.slice(0, 90)
                }
                ...
              </p>

              {/* TAGS */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "14px",
                  flexWrap: "wrap",
                }}
              >

                <div
                  style={{
                    background: "#ede9fe",
                    color: "#6366f1",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  {email.department}
                </div>

                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  {email.ticket_status}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* RIGHT DETAILS PANEL */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          overflowY: "auto",
        }}
      >

        {!selectedEmail ? (

          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            Select an email
          </div>

        ) : (

          <div
            style={{
              padding: "34px",
            }}
          >

            {/* HEADER */}
            <div
              style={{
                marginBottom: "28px",
              }}
            >

              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "12px",
                }}
              >
                {selectedEmail.subject}
              </h1>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "15px",
                  marginBottom: "18px",
                }}
              >
                {selectedEmail.sender}
              </p>

              {/* TAGS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <div
                  style={{
                    background: "#eef2ff",
                    color: "#4338ca",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  🎫 {
                    selectedEmail.ticket_id
                  }
                </div>

                <div
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  ⚡ {
                    selectedEmail.priority
                  }
                </div>

                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  📌 {
                    selectedEmail.ticket_status
                  }
                </div>

              </div>

            </div>

            {/* ORIGINAL EMAIL */}
            <div
              style={{
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "26px",
              }}
            >

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "18px",
                }}
              >
                Customer Email
              </h2>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "2",
                  color: "#475569",
                  fontSize: "15px",
                }}
              >
                {selectedEmail.body}
              </div>

            </div>

            {/* AI RESPONSE */}
            <div
              style={{
                background:
                  "linear-gradient(to bottom,#eef2ff,#ffffff)",

                border:
                  "1px solid #c7d2fe",

                borderRadius: "20px",

                padding: "30px",
              }}
            >

              {/* AI HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "22px",
                }}
              >

                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",

                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",

                    color: "white",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    fontWeight: "700",

                    fontSize: "16px",
                  }}
                >
                  AI
                </div>

                <div>

                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#312e81",
                    }}
                  >
                    Enterprise AI Reply
                  </h2>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6366f1",
                    }}
                  >
                    Generated using
                    Azure OpenAI + RAG
                  </p>

                </div>

              </div>

              {/* AI CONTENT */}
              <div
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #dbeafe",

                  borderRadius: "18px",

                  padding: "26px",

                  whiteSpace: "pre-wrap",

                  lineHeight: "2.1",

                  fontSize: "15px",

                  color: "#334155",
                }}
              >
                {
                  selectedEmail.ai_reply
                }
              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}