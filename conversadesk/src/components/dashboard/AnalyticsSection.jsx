import {
  useEffect,
  useState,
} from "react";

export default function AnalyticsSection() {

  const [analytics, setAnalytics] =
    useState({

      weeklyData: [0, 0, 0, 0, 0, 0, 0],

      escalationRisk: 0,

      slaHealth: 0,

      mostActiveDept: "N/A",
    });

  const [loading, setLoading] =
    useState(true);

  const days = [

    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  // FETCH ANALYTICS
  const fetchAnalytics =
    async () => {

      try {

        const response =
          await fetch(

            "http://127.0.0.1:8000/dashboard-analytics"
          );

        const data =
          await response.json();

        setAnalytics(data);

      } catch (error) {

        console.log(
          "ANALYTICS ERROR:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchAnalytics();

    const interval =
      setInterval(() => {

        fetchAnalytics();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "2fr 1fr",

        gap: "20px",

        marginTop: "30px",
      }}
    >

      {/* LEFT CHART */}
      <div
        style={{
          background: "#ffffff",

          borderRadius: "20px",

          padding: "26px",

          border:
            "1px solid #e2e8f0",

          boxShadow:
            "0 4px 18px rgba(0,0,0,0.04)",
        }}
      >

        {/* HEADER */}
        <div
          style={{
            marginBottom: "26px",
          }}
        >

          <h2
            style={{
              fontSize: "20px",

              fontWeight: "700",

              color: "#1e293b",
            }}
          >
            Weekly Ticket Overview
          </h2>

          <p
            style={{
              marginTop: "6px",

              fontSize: "14px",

              color: "#64748b",
            }}
          >
            Real-time ticket activity
          </p>

        </div>

        {/* BARS */}
        <div
          style={{
            height: "280px",

            display: "flex",

            alignItems: "flex-end",

            gap: "16px",
          }}
        >

          {analytics.weeklyData.map(

            (value, index) => (

              <div
                key={index}

                style={{
                  flex: 1,

                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  gap: "12px",
                }}
              >

                {/* VALUE */}
                <span
                  style={{
                    fontSize: "13px",

                    color: "#64748b",

                    fontWeight: "600",
                  }}
                >
                  {value}
                </span>

                {/* BAR */}
                <div
                  style={{
                    width: "100%",

                    height:
                      `${Math.max(
                        value * 12,
                        20
                      )}px`,

                    borderRadius:
                      "14px 14px 0 0",

                    background:
                      "linear-gradient(180deg,#6366f1,#8b5cf6)",

                    transition:
                      "0.3s",
                  }}
                />

                {/* DAY */}
                <span
                  style={{
                    fontSize: "12px",

                    color: "#64748b",

                    fontWeight: "500",
                  }}
                >
                  {days[index]}
                </span>

              </div>
            )
          )}

        </div>

      </div>

      {/* RIGHT AI INSIGHTS */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#6366f1,#8b5cf6)",

          borderRadius: "20px",

          padding: "28px",

          color: "white",

          boxShadow:
            "0 8px 30px rgba(99,102,241,0.3)",
        }}
      >

        <h2
          style={{
            fontSize: "22px",

            fontWeight: "700",

            marginBottom: "30px",
          }}
        >
          ◈ AI Insights
        </h2>

        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: "30px",
          }}
        >

          {/* ESCALATION */}
          <div>

            <p
              style={{
                fontSize: "14px",

                opacity: 0.85,
              }}
            >
              Escalation Risk
            </p>

            <h1
              style={{
                marginTop: "8px",

                fontSize: "38px",

                fontWeight: "700",
              }}
            >
              {loading
                ? "..."
                : `${analytics.escalationRisk}%`}
            </h1>

          </div>

          {/* SLA */}
          <div>

            <p
              style={{
                fontSize: "14px",

                opacity: 0.85,
              }}
            >
              SLA Health Score
            </p>

            <h1
              style={{
                marginTop: "8px",

                fontSize: "38px",

                fontWeight: "700",
              }}
            >
              {loading
                ? "..."
                : `${analytics.slaHealth}/100`}
            </h1>

          </div>

          {/* DEPARTMENT */}
          <div>

            <p
              style={{
                fontSize: "14px",

                opacity: 0.85,
              }}
            >
              Most Active Dept
            </p>

            <h1
              style={{
                marginTop: "8px",

                fontSize: "26px",

                fontWeight: "700",

                lineHeight: "1.4",
              }}
            >
              {loading
                ? "..."
                : analytics.mostActiveDept}
            </h1>

          </div>

        </div>

      </div>

    </div>
  );
}

