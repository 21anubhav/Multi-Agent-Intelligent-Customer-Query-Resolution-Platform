
import {
  useEffect,
  useState,
} from "react";

export default function StatsCards() {

  const [stats, setStats] =
    useState({

      totalTickets: 0,

      openTickets: 0,

      criticalTickets: 0,

      resolvedTickets: 0,
    });

  const [loading, setLoading] =
    useState(true);

  // FETCH DASHBOARD STATS
  const fetchStats = async () => {

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/dashboard-stats"
      );

      const data =
        await response.json();

      setStats(data);

    } catch (error) {

      console.log(
        "STATS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchStats();

    // AUTO REFRESH
    const interval =
      setInterval(() => {

        fetchStats();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  const cards = [

    {
      title: "Total Tickets",

      value: loading
        ? "..."
        : stats.totalTickets,

      icon: "☰",

      bg: "#ede9fe",

      color: "#6366f1",
    },

    {
      title: "Open Tickets",

      value: loading
        ? "..."
        : stats.openTickets,

      icon: "◉",

      bg: "#dbeafe",

      color: "#2563eb",
    },

    {
      title: "Critical Issues",

      value: loading
        ? "..."
        : stats.criticalTickets,

      icon: "⚠",

      bg: "#fee2e2",

      color: "#dc2626",
    },

    {
      title: "Resolved Tickets",

      value: loading
        ? "..."
        : stats.resolvedTickets,

      icon: "✓",

      bg: "#dcfce7",

      color: "#16a34a",
    },
  ];

  return (

    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",

        gap: "20px",

        marginTop: "30px",
      }}
    >

      {cards.map((card, index) => (

        <div
          key={index}

          style={{
            background: "#ffffff",

            borderRadius: "20px",

            padding: "26px",

            border:
              "1px solid #e2e8f0",

            boxShadow:
              "0 4px 18px rgba(0,0,0,0.04)",

            transition: "0.2s",

            cursor: "pointer",
          }}

          onMouseEnter={(e) => {

            e.currentTarget.style.transform =
              "translateY(-4px)";

            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(99,102,241,0.12)";
          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.transform =
              "translateY(0px)";

            e.currentTarget.style.boxShadow =
              "0 4px 18px rgba(0,0,0,0.04)";
          }}
        >

          {/* TOP */}
          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              marginBottom: "22px",
            }}
          >

            {/* ICON */}
            <div
              style={{
                width: "58px",

                height: "58px",

                borderRadius: "16px",

                background: card.bg,

                color: card.color,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                fontSize: "26px",
              }}
            >
              {card.icon}
            </div>

            {/* LIVE BADGE */}
            <div
              style={{
                background: "#dcfce7",

                color: "#16a34a",

                fontSize: "11px",

                fontWeight: "700",

                padding: "6px 10px",

                borderRadius: "999px",
              }}
            >
              LIVE
            </div>

          </div>

          {/* VALUE */}
          <h2
            style={{
              fontSize: "38px",

              fontWeight: "700",

              color: "#1e293b",

              marginBottom: "8px",
            }}
          >
            {card.value}
          </h2>

          {/* TITLE */}
          <p
            style={{
              fontSize: "15px",

              color: "#64748b",

              fontWeight: "500",
            }}
          >
            {card.title}
          </p>

        </div>

      ))}

    </div>
  );
}

