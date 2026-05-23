import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import Sidebar from "../components/layout/sidebar";
import Navbar from "../components/layout/Navbar";

export default function AnalyticsPage({
  role,
  setPage,
  onLogout,
}) {

  const [sideOpen, setSideOpen] =
    useState(true);

  const [nav, setNav] =
    useState("analytics");

 const [analytics,
setAnalytics] =
  useState(() => {

    const cached =
      localStorage.getItem(
        "analytics_cache"
      );

    return cached
      ? JSON.parse(cached)
      : {

          total_tickets: 0,

          open_tickets: 0,

          resolved_tickets: 0,

          critical_tickets: 0,

          trend_data: [],

          departments: [],

          priority_data: [],

          sentiment_data: [],

          ai_insights: [],
        };
  });

  const [loading,
  setLoading] =
    useState(false);

  // =========================
  // FETCH ANALYTICS
  // =========================

  useEffect(() => {

    fetchAnalytics();

    const interval =
      setInterval(() => {

        fetchAnalytics();

      }, 30000);

    return () =>
      clearInterval(interval);

  }, []);

  const fetchAnalytics =
  async () => {

    try {

      

      const response =
        await fetch(
          "http://127.0.0.1:8000/dashboard-analytics2"
        );

      if (!response.ok) {

        throw new Error(
          "Analytics fetch failed"
        );
      }

      const data =
        await response.json();
      
      localStorage.setItem(
      "analytics_cache",
       JSON.stringify(data)
       );
      console.log(
        "ANALYTICS:",
        data
      );

      // PRESERVE OLD DATA
      setAnalytics((prev) => ({

        ...prev,

        ...data,

        trend_data:
          data?.trend_data?.length
            ? data.trend_data
            : prev.trend_data,

        departments:
          data?.departments?.length
            ? data.departments
            : prev.departments,

        priority_data:
          data?.priority_data?.length
            ? data.priority_data
            : prev.priority_data,

        sentiment_data:
          data?.sentiment_data?.length
            ? data.sentiment_data
            : prev.sentiment_data,

        ai_insights:
          data?.ai_insights?.length
            ? data.ai_insights
            : prev.ai_insights,
      }));

    } catch (error) {

      console.log(
        "ANALYTICS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // KPI CARDS
  // =========================

  const cards = [

    {
      title: "Total Tickets",

      value:
        analytics?.total_tickets || 0,

      sub:
        "Enterprise-wide tickets",

      bg: "#ede9fe",

      color: "#6366f1",
    },

    {
      title: "Open Tickets",

      value:
        analytics?.open_tickets || 0,

      sub:
        "Currently unresolved",

      bg: "#dbeafe",

      color: "#2563eb",
    },

    {
      title: "Resolved Tickets",

      value:
        analytics?.resolved_tickets || 0,

      sub:
        "Successfully resolved",

      bg: "#dcfce7",

      color: "#16a34a",
    },

    {
      title: "Critical Issues",

      value:
        analytics?.critical_tickets || 0,

      sub:
        "Immediate attention required",

      bg: "#fee2e2",

      color: "#dc2626",
    },
  ];

  const insights =
    analytics?.ai_insights || [];

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
        fontFamily:
          "system-ui, sans-serif",
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
          minWidth: 0,
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
            overflowY: "auto",
            padding: "32px",
            paddingBottom: "120px",
            animation:
              "fadeIn 0.4s ease",
          }}
        >

          {/* HEADER */}
          <div
            style={{
              marginBottom: "34px",
            }}
          >

            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "10px",
              }}
            >
              Enterprise Analytics
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              AI-powered operational intelligence
              and enterprise support analytics
            </p>

            {/* LIVE STATUS */}
            <div
              style={{
                marginTop: "18px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#dcfce7",
                color: "#166534",
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >

              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#16a34a",
                }}
              />

              Live Enterprise Monitoring

            </div>

            {/* REFRESH */}
            <div
              style={{
                marginTop: "12px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Auto-refreshing every 30 seconds
            </div>

          </div>

          {/* KPI CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: "22px",
              marginBottom: "30px",
            }}
          >

            {cards.map((card, index) => (

              <div
                key={index}
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "28px",
                  border:
                    "1px solid #e2e8f0",
                  boxShadow:
                    "0 4px 20px rgba(15,23,42,0.04)",
                  transition:
                    "0.25s ease",
                  cursor: "pointer",
                }}
              >

                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "18px",
                    background: card.bg,
                    marginBottom: "20px",
                  }}
                />

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    marginBottom: "10px",
                  }}
                >
                  {card.title}
                </p>

                <h1
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: card.color,
                  }}
                >
                  {card.value}
                </h1>

                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  {card.sub}
                </p>

              </div>

            ))}

          </div>

          {/* MAIN GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >

            {/* AREA CHART */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "28px",
                border:
                  "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 20px rgba(15,23,42,0.04)",
              }}
            >

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Ticket Activity Trend
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "24px",
                }}
              >
                Weekly open vs resolved tickets
              </p>

              <div
                style={{
                  width: "100%",
                  height: "320px",
                }}
              >

                <ResponsiveContainer>

                  <AreaChart
                    data={
                      analytics?.trend_data?.length
                        ? analytics.trend_data
                        : [
                            {
                              day: "No Data",
                              open: 0,
                              resolved: 0,
                            },
                          ]
                    }
                  >

                    <defs>

                      <linearGradient
                        id="openColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.5}
                        />

                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="open"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#openColor)"
                    />

                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke="#16a34a"
                      fill="#dcfce7"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* AI INSIGHTS */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: "24px",
                padding: "28px",
                color: "white",
                boxShadow:
                  "0 12px 30px rgba(99,102,241,0.25)",
              }}
            >

              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  marginBottom: "14px",
                }}
              >
                ◈ AI Insights
              </h2>

              <p
                style={{
                  opacity: 0.85,
                  lineHeight: 1.6,
                  marginBottom: "24px",
                  fontSize: "13px",
                }}
              >
                Real-time AI-powered operational
                risk and enterprise intelligence.
              </p>

              {
                loading ? (

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >

                    {[1, 2, 3, 4].map((i) => (

                      <div
                        key={i}
                        style={{
                          height: "18px",
                          borderRadius: "999px",
                          background:
                            "rgba(255,255,255,0.2)",
                        }}
                      />

                    ))}

                  </div>

                ) : (

                  insights.map((item, index) => (

                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "16px",
                        alignItems: "flex-start",
                      }}
                    >

                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: "white",
                          marginTop: "7px",
                          flexShrink: 0,
                        }}
                      />

                      <p
                        style={{
                          lineHeight: 1.6,
                          fontSize: "13px",
                          opacity: 0.96,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item}
                      </p>

                    </div>

                  ))

                )
              }

            </div>

          </div>

          {/* SECOND GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >

            {/* PIE CHART */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "28px",
                border:
                  "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 20px rgba(15,23,42,0.04)",
              }}
            >

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Department Distribution
              </h2>

              <div
                style={{
                  width: "100%",
                  height: "320px",
                }}
              >

                <ResponsiveContainer>

                  <PieChart>

                    <Pie
                      data={
                        analytics?.departments?.length
                          ? analytics.departments
                          : [
                              {
                                name: "No Data",
                                value: 1,
                                color: "#cbd5e1",
                              },
                            ]
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                    >

                      {(analytics?.departments || [])
                        .map((entry, index) => (

                          <Cell
                            key={index}
                            fill={entry.color}
                          />

                        ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* BAR CHART */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "28px",
                border:
                  "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 20px rgba(15,23,42,0.04)",
              }}
            >

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                Priority Distribution
              </h2>

              <div
                style={{
                  width: "100%",
                  height: "320px",
                }}
              >

                <ResponsiveContainer>

                  <BarChart
                    data={
                      analytics?.priority_data?.length
                        ? analytics.priority_data
                        : [
                            {
                              name: "No Data",
                              value: 0,
                            },
                          ]
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* SENTIMENT */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              border:
                "1px solid #e2e8f0",
              boxShadow:
                "0 4px 20px rgba(15,23,42,0.04)",
            }}
          >

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Customer Sentiment Analysis
            </h2>

            <div
              style={{
                width: "100%",
                height: "320px",
              }}
            >

              <ResponsiveContainer>

                <LineChart
                  data={
                    analytics?.sentiment_data?.length
                      ? analytics.sentiment_data
                      : [
                          {
                            month: "No Data",
                            positive: 0,
                            negative: 0,
                          },
                        ]
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />

                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#dc2626"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}