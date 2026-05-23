import { useState } from "react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/Navbar";
import RecentEmails from "../components/dashboard/RecentEmails";
import StatsCards from "../components/dashboard/StatsCards";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";
import RecentTickets from "../components/dashboard/RecentTickets";

export default function DashboardPage({
  role,
  setPage,
  onLogout,
}) {
  const [sideOpen, setSideOpen] = useState(true);

  const [nav, setNav] = useState("dashboard");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        sideOpen={sideOpen}
        setSideOpen={setSideOpen}
        nav={nav}
        setNav={setNav}
        role={role}
        setPage={setPage}
      />

      {/* Main Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Navbar */}
        <Navbar
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          role={role}
          onLogout={onLogout}
        />

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "30px",
            background: "#f8fafc",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                marginTop: "10px",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Welcome to ConversaDesk AI
            </p>
          </div>

          {/* Dashboard Sections */}
          <StatsCards />

          <AnalyticsSection />
          
       <RecentTickets
  setPage={setPage}
/>
        </div>
      </div>
    </div>
  );
}