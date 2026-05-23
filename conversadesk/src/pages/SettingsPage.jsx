import { useState } from "react";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/Navbar";

export default function SettingsPage({
  role,
  setPage,
  onLogout,
}) {
  const [sideOpen, setSideOpen] = useState(true);

  const [nav, setNav] = useState("settings");

  const [notifications, setNotifications] =
    useState(true);

  const [emailAlerts, setEmailAlerts] =
    useState(false);

  const [aiInsights, setAiInsights] =
    useState(true);

  const Toggle = ({ value, setValue }) => (
    <div
      onClick={() => setValue(!value)}
      style={{
        width: "52px",
        height: "28px",
        borderRadius: "999px",
        background: value
          ? "#6366f1"
          : "#cbd5e1",
        position: "relative",
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "3px",
          left: value ? "27px" : "3px",
          transition: "0.2s",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
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
            flex: 1,
            padding: "30px",
            overflowY: "scroll",
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
              Settings
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#64748b",
              }}
            >
              Manage your account preferences
            </p>
          </div>

          {/* Profile Section */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "20px",
              }}
            >
              Profile Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Full Name
                </label>

                <input
                  defaultValue={
                    role === "manager"
                      ? "Alex Manager"
                      : "Jordan Employee"
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Email
                </label>

                <input
                  defaultValue="user@company.com"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "24px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "24px",
              }}
            >
              Preferences
            </h2>

            {/* Notification */}
            <SettingRow
              title="Push Notifications"
              description="Receive real-time ticket alerts"
              control={
                <Toggle
                  value={notifications}
                  setValue={setNotifications}
                />
              }
            />

            {/* Email */}
            <SettingRow
              title="Email Alerts"
              description="Receive updates via email"
              control={
                <Toggle
                  value={emailAlerts}
                  setValue={setEmailAlerts}
                />
              }
            />

            {/* AI */}
            <SettingRow
              title="AI Insights"
              description="Enable AI-generated recommendations"
              control={
                <Toggle
                  value={aiInsights}
                  setValue={setAiInsights}
                />
              }
            />
          </div>

          {/* Save */}
          <button
            style={{
              marginTop: "30px",
              padding: "14px 24px",
              borderRadius: "14px",
              border: "none",
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  control,
}) {
  return (
    <div
      style={{
        padding: "18px 0",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#1e293b",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: "6px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {description}
        </p>
      </div>

      {control}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  outline: "none",
  background: "#f8fafc",
};