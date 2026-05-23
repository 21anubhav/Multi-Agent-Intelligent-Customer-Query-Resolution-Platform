export default function Sidebar({
  sideOpen,
  setSideOpen,
  nav,
  setNav,
  role,
  setPage,
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const menuItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⊞"
    },

    {
      id: "chat",
      label: "AI Assistant",
      icon: "◈"
    },

    {
      id: "mails",
      label: "Emails",
      icon: "✉"
    },

    {
      id: "tickets",
      label: "Tickets",
      icon: "☰"
    },

    {
      id: "analytics",
      label: "Analytics",
      icon: "◫"
    },

    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: "⚙"
    // },
  ];

  return (

    <aside
      style={{
        width: sideOpen ? 240 : 70,

        background: "#ffffff",

        borderRight: "1px solid #e2e8f0",

        transition: "0.2s",

        display: "flex",

        flexDirection: "column",

        height: "100vh",
      }}
    >

      {/* Logo */}
      <div
        style={{
          padding: "20px",

          borderBottom: "1px solid #e2e8f0",

          display: "flex",

          alignItems: "center",

          gap: "12px",
        }}
      >

        <div
          style={{
            width: "40px",

            height: "40px",

            borderRadius: "10px",

            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",

            color: "white",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            fontWeight: "700",
          }}
        >
          C
        </div>

        {sideOpen && (

          <div>

            <h2
              style={{
                fontSize: "16px",

                color: "#1e293b",

                margin: 0,
              }}
            >
              ConversaDesk
            </h2>

            <p
              style={{
                fontSize: "12px",

                color: "#8b5cf6",

                margin: 0,
              }}
            >
              AI Platform
            </p>

          </div>

        )}

      </div>

      {/* Menu */}
      <div
        style={{
          flex: 1,

          padding: "12px",
        }}
      >

        {menuItems.map((item) => (

          <button
            key={item.id}

            onClick={() => {

              setNav(item.id);

              if (item.id === "dashboard") {

                setPage("dashboard");
              }

              if (item.id === "chat") {

                setPage("chat");
              }

              if (item.id === "mails") {

                setPage("mails");
              }

              if (item.id === "tickets") {

                setPage("tickets");
              }

              if (item.id === "analytics") {

                setPage("analytics");
              }

              // if (item.id === "settings") {

              //   setPage("settings");
              // }

            }}

            style={{

              width: "100%",

              display: "flex",

              alignItems: "center",

              gap: "12px",

              padding: "12px",

              border: "none",

              borderRadius: "10px",

              marginBottom: "8px",

              cursor: "pointer",

              transition: "0.2s",

              background:

                nav === item.id

                  ? "linear-gradient(135deg,#ede9fe,#dbeafe)"

                  : "transparent",

              color:

                nav === item.id

                  ? "#6366f1"

                  : "#64748b",

              fontWeight:

                nav === item.id

                  ? "600"

                  : "500",
            }}
          >

            <span
              style={{
                fontSize: "16px",
              }}
            >
              {item.icon}
            </span>

            {sideOpen && (

              <span>
                {item.label}
              </span>

            )}

          </button>

        ))}

      </div>

      {/* User */}
      <div
        style={{
          padding: "16px",

          borderTop: "1px solid #e2e8f0",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "10px",
          }}
        >

          {/* Avatar */}
          <div
            style={{
              width: "36px",

              height: "36px",

              borderRadius: "50%",

              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",

              color: "white",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontWeight: "700",
            }}
          >
            {role === "manager"
              ? "MG"
              : "EM"}
          </div>

          {/* User Info */}
          {sideOpen && (

            <div>

              <p
                style={{
                  fontSize: "13px",

                  fontWeight: "600",

                  color: "#1e293b",

                  margin: 0,
                }}
              >
                {user?.name || "User"}
              </p>

              <p
                style={{
                  fontSize: "11px",

                  color: "#8b5cf6",

                  textTransform: "capitalize",

                  margin: 0,
                }}
              >
                {role}
              </p>

            </div>

          )}

        </div>

      </div>

    </aside>
  );
}