import { useState } from "react";

import Sidebar from "../components/layout/sidebar";

import Navbar from "../components/layout/Navbar";

import RecentEmails from "../components/dashboard/RecentEmails";


export default function MailsPage({
  role,
  setPage,
  onLogout,
}) {

  const [sideOpen, setSideOpen] = useState(true);

  const [nav, setNav] = useState("mails");

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f8fafc",
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

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* Navbar */}
        <Navbar
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          role={role}
          onLogout={onLogout}
        />

        {/* Content */}
        <div
          style={{
            padding: "30px",
            overflowY: "auto",
          }}
        >

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "10px",
            }}
          >
            Enterprise Mails
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: "30px",
            }}
          >
            AI-powered email monitoring center
          </p>

          <RecentEmails />

        </div>

      </div>

    </div>
  );
}