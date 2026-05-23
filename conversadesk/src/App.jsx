
import {
  useEffect,
  useState,
} from "react";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

import ChatPage from "./pages/ChatPage";

import TicketsPage from "./pages/TicketsPage";

import AnalyticsPage from "./pages/AnalyticsPage";

import SettingsPage from "./pages/SettingsPage";

import MailsPage from "./pages/MailsPage";


export default function App() {

  const [page, setPage] =
    useState("login");

  const [role, setRole] =
    useState("employee");

  const [loading, setLoading] =
    useState(true);


  // =========================
  // AUTO LOGIN
  // =========================

  useEffect(() => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      if (user) {

        setRole(
          user.role || "employee"
        );

        setPage("dashboard");

      }

    } catch (error) {

      console.log(
        "AUTO LOGIN ERROR:",
        error
      );

      localStorage.removeItem(
        "user"
      );
    }

    setLoading(false);

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "user"
    );

    setRole("employee");

    setPage("login");
  };


  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >

        <div
          style={{
            textAlign: "center",
          }}
        >

          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: "#6366f1",
              marginBottom: "10px",
            }}
          >
            ConversaDesk AI
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Loading enterprise workspace...
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // LOGIN PAGE
  // =========================

  if (page === "login") {

    return (

      <LoginPage

        onLogin={(selectedRole) => {

          setRole(selectedRole);

          setPage("dashboard");
        }}
      />
    );
  }


  // =========================
  // MAIN APPLICATION
  // =========================

  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f8fafc",
        overflowX: "hidden",
      }}
    >

      {/* DASHBOARD */}
      {page === "dashboard" && (

        <DashboardPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}


      {/* CHAT */}
      {page === "chat" && (

        <ChatPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}


      {/* MAILS */}
      {page === "mails" && (

        <MailsPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}


      {/* TICKETS */}
      {page === "tickets" && (

        <TicketsPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}


      {/* ANALYTICS */}
      {page === "analytics" && (

        <AnalyticsPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}


      {/* SETTINGS */}
      {page === "settings" && (

        <SettingsPage
          role={role}
          setPage={setPage}
          onLogout={handleLogout}
        />

      )}

    </div>
  );
}

