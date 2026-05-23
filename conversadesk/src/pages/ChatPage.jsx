import {
  useState,
  useEffect,
  useRef,
} from "react";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import Sidebar from "../components/layout/sidebar";

import Navbar from "../components/layout/Navbar";

export default function ChatPage({
  role,
  setPage,
  onLogout,
}) {

  const [sideOpen, setSideOpen] =
    useState(true);

  const [nav, setNav] =
    useState("chat");

  const [loading, setLoading] =
    useState(false);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [activeChatId, setActiveChatId] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [pendingEmail,
   setPendingEmail] =
  useState(null);

  const messagesEndRef =
    useRef(null);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.
      scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // LOAD CHATS
  useEffect(() => {

    const savedChats = JSON.parse(

      localStorage.getItem(
        "chat_sessions"
      )

    ) || [];

    if (savedChats.length > 0) {

      setChatHistory(savedChats);

      setActiveChatId(
        savedChats[0].id
      );

      setMessages(
        savedChats[0].messages
      );

    } else {

      createNewChat();
    }

  }, []);

  // SAVE CHAT
  useEffect(() => {

    if (!activeChatId) return;

    const updatedChats =
      chatHistory.map((chat) =>

        chat.id === activeChatId

          ? {
              ...chat,
              messages,
            }

          : chat
      );

    setChatHistory(updatedChats);

    localStorage.setItem(

      "chat_sessions",

      JSON.stringify(updatedChats)
    );

  }, [messages]);

  // CREATE CHAT
  const createNewChat = () => {

    const newChat = {

      id: Date.now(),

      title: "New Conversation",

      messages: [
        {
          role: "ai",
          text:
            "# Welcome to ConversaDesk AI\n\nHow can I help you today?",
        },
      ],
    };

    const updatedChats = [

      newChat,

      ...chatHistory,
    ];

    setChatHistory(updatedChats);

    localStorage.setItem(

      "chat_sessions",

      JSON.stringify(updatedChats)
    );

    setActiveChatId(newChat.id);

    setMessages(newChat.messages);
  };

  // SWITCH CHAT
  const switchChat = (chat) => {

    setActiveChatId(chat.id);

    setMessages(chat.messages);
  };

  // SEND MESSAGE
  // SEND MESSAGE
const sendMessage = async () => {

  if (!input.trim()) return;

  const userMessage = input;

  // =========================
  // EMAIL CONFIRMATION FLOW
  // =========================

  if (

    pendingEmail &&

    (
      userMessage
        .toLowerCase()
        .includes("yes")

      ||

      userMessage
        .toLowerCase()
        .includes("send")

      ||

      userMessage
        .toLowerCase()
        .includes("confirm")
    )
  ) {

    const updatedMessages = [

      ...messages,

      {
        role: "user",
        text: userMessage,
      },
    ];

    setMessages(updatedMessages);

    setInput("");

    try {

      setLoading(true);

      const response =
        await fetch(

          "http://127.0.0.1:8000/send-reply",

          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              to:
                pendingEmail.to,

              subject:
                pendingEmail.subject,

              body:
                pendingEmail.body,
            }),
          }
        );

      const data =
        await response.json();

      let finalMessage = "";

      if (

  data.message &&

  data.message.includes(
    "successfully"
  )
) {

  finalMessage =
    `✅ Email sent successfully to ${pendingEmail.to}`;

} else {

  finalMessage =
    "❌ Failed to send email.";
}

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",
          text: finalMessage,
        },
      ]);

      setPendingEmail(null);

      return;

    } catch (error) {

      console.log(error);

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",

          text:
            "❌ Email sending failed.",
        },
      ]);

      return;

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // NORMAL CHAT FLOW
  // =========================

  const updatedMessages = [

    ...messages,

    {
      role: "user",
      text: userMessage,
    },
  ];

  setMessages(updatedMessages);

  setInput("");

  setLoading(true);

  // UPDATE TITLE
  if (messages.length <= 1) {

    const updatedChats =
      chatHistory.map((chat) =>

        chat.id === activeChatId

          ? {
              ...chat,
              title:
                userMessage.slice(
                  0,
                  28
                ) + "...",
            }

          : chat
      );

    setChatHistory(updatedChats);

    localStorage.setItem(

      "chat_sessions",

      JSON.stringify(updatedChats)
    );
  }

  try {

    const response = await fetch(

      "http://127.0.0.1:8000/chat",

      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          message: userMessage,

          role: role,

          history: updatedMessages,
        }),
      }
    );

    const data =
      await response.json();

    const aiReply =
      data.response;

    // =========================
    // EMAIL DETECTION
    // =========================

    if (

      aiReply.includes("Subject:")

      &&

      aiReply.includes("Message:")
    ) {

      // SUBJECT
      const subjectMatch =

        aiReply.match(
          /Subject:(.*)/i
        );

      // BODY
      const messageMatch =

        aiReply.match(
          /Message:([\s\S]*)/i
        );

      let subject =
        "Enterprise Support Update";

      let body =
        aiReply;

      if (subjectMatch) {

        subject =
          subjectMatch[1]
          .trim();
      }

      if (messageMatch) {

        body =
          messageMatch[1]
          .trim();
      }

      // DETECT EMAIL
      let detectedEmail = "";

      const emailMatch =

        aiReply.match(

          /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );

      if (emailMatch) {

        detectedEmail =
          emailMatch[0];
      }

      setPendingEmail({

        to:
          detectedEmail,

        subject:
          subject,

        body:
          body,
      });
    }

    setMessages((prev) => [

      ...prev,

      {
        role: "ai",
        text: aiReply,
      },
    ]);

  } catch (error) {

    console.log(error);

    setMessages((prev) => [

      ...prev,

      {
        role: "ai",

        text:
          "❌ Unable to connect to AI service.",
      },
    ]);

  } finally {

    setLoading(false);
  }
};
  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f8fafc",
        overflow: "hidden",
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
          overflow: "hidden",
        }}
      >

        <Navbar
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          role={role}
          onLogout={onLogout}
        />

        {/* BODY */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: "20px",
            padding: "20px",
            overflow: "hidden",
          }}
        >

          {/* HISTORY */}
          <div
            style={{
              width: "300px",
              background: "#ffffff",
              borderRadius: "22px",
              border:
                "1px solid #e2e8f0",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "22px",
              }}
            >
              Conversations
            </h2>

            <button
              onClick={createNewChat}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
                marginBottom: "22px",
                fontSize: "14px",
              }}
            >
              + New Chat
            </button>

            <div
              style={{
                overflowY: "auto",
                flex: 1,
              }}
            >

              {chatHistory.map((chat) => (

                <div
                  key={chat.id}

                  onClick={() =>
                    switchChat(chat)
                  }

                  style={{
                    padding: "16px",
                    borderRadius: "14px",

                    background:

                      activeChatId ===
                      chat.id

                        ? "#ede9fe"

                        : "#f8fafc",

                    marginBottom: "12px",

                    cursor: "pointer",

                    border:

                      activeChatId ===
                      chat.id

                        ? "1px solid #8b5cf6"

                        : "1px solid #e2e8f0",

                    transition: "0.2s",
                  }}
                >

                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1e293b",
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {chat.title}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* CHAT */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              borderRadius: "22px",
              border:
                "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >

            {/* HEADER */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom:
                  "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                ◈
              </div>

              <div>

                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  ConversaDesk AI
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#16a34a",
                    marginTop: "4px",
                  }}
                >
                  ● AI Assistant Online
                </p>

              </div>

            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                background: "#fcfcfd",
              }}
            >

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    style={{
                      display: "flex",

                      justifyContent:

                        message.role ===
                        "user"

                          ? "flex-end"

                          : "flex-start",
                    }}
                  >

                    <div
                      style={{
                        maxWidth: "78%",
                        padding:
                          "18px 22px",

                        borderRadius:

                          message.role ===
                          "user"

                            ? "22px 22px 6px 22px"

                            : "22px 22px 22px 6px",

                        background:

                          message.role ===
                          "user"

                            ? "linear-gradient(135deg,#6366f1,#8b5cf6)"

                            : "#ffffff",

                        color:

                          message.role ===
                          "user"

                            ? "white"

                            : "#1e293b",

                        border:

                          message.role ===
                          "ai"

                            ? "1px solid #e2e8f0"

                            : "none",

                        lineHeight: 1.8,

                        fontSize: "15px",

                        boxShadow:

                          message.role ===
                          "ai"

                            ? "0 4px 14px rgba(0,0,0,0.04)"

                            : "none",

                        overflowWrap:
                          "anywhere",

                        wordBreak:
                          "break-word",
                      }}
                    >

                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm,
                        ]}
                        components={{

                          table:
                            ({
                              children,
                            }) => (

                              <div
                                style={{
                                  overflowX:
                                    "auto",

                                  marginTop:
                                    "16px",

                                  marginBottom:
                                    "16px",

                                  border:
                                    "1px solid #e2e8f0",

                                  borderRadius:
                                    "12px",
                                }}
                              >

                                <table
                                  style={{
                                    width:
                                      "100%",

                                    borderCollapse:
                                      "collapse",

                                    background:
                                      "white",
                                  }}
                                >
                                  {
                                    children
                                  }
                                </table>

                              </div>
                            ),

                          th: ({
                            children,
                          }) => (
                            
<th
                                  style={{
                                    padding: "14px",
                                    background: "#f8fafc",
                                    borderBottom: "1px solid #e2e8f0",
                                    textAlign: "left",
                                    fontWeight: "700",
                                    color: "#1e293b",
                                    whiteSpace: "nowrap",
                                    minWidth: "140px",
                                  }}
                                >
                                  {children}
                                </th>


                          ),

                          td: ({
                            children,
                          }) => (
                            <td style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", color: "#334155", verticalAlign: "top", whiteSpace: "normal", minWidth: "140px", lineHeight: "1.7", }} > {children} </td>
                          ),

                          p: ({
                            children,
                          }) => (
                            <p
                              style={{
                                marginBottom:
                                  "14px",
                              }}
                            >
                              {
                                children
                              }
                            </p>
                          ),

                          li: ({
                            children,
                          }) => (
                            <li
                              style={{
                                marginBottom:
                                  "8px",
                              }}
                            >
                              {
                                children
                              }
                            </li>
                          ),

                          code: ({
                            children,
                          }) => (
                            <code
                              style={{
                                background:
                                  "#f1f5f9",

                                padding:
                                  "4px 8px",

                                borderRadius:
                                  "6px",

                                color:
                                  "#7c3aed",
                              }}
                            >
                              {
                                children
                              }
                            </code>
                          ),
                        }}
                      >
                        {
                          message.text
                        }
                      </ReactMarkdown>

                    </div>

                  </div>

                )
              )}

              {loading && (

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  ConversaDesk AI is typing...
                </div>

              )}

              <div
                ref={messagesEndRef}
              />

            </div>

            {/* INPUT */}
            <div
              style={{
                padding: "20px",
                borderTop:
                  "1px solid #e2e8f0",
                display: "flex",
                gap: "14px",
                background: "white",
              }}
            >

              <input
                value={input}

                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }

                onKeyDown={(e) =>
                  e.key === "Enter"
                    && sendMessage()
                }

                placeholder="Ask about tickets, analytics, customer replies, email drafting..."

                style={{
                  flex: 1,
                  padding:
                    "16px 18px",
                  borderRadius:
                    "16px",
                  border:
                    "1px solid #e2e8f0",
                  outline: "none",
                  background:
                    "#f8fafc",
                  fontSize: "15px",
                }}
              />

              <button
                onClick={sendMessage}

                disabled={loading}

                style={{
                  padding:
                    "16px 28px",
                  borderRadius:
                    "16px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "white",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

