# Multi-Agent Intelligent Customer Query Resolution Platform

An AI-powered enterprise helpdesk automation platform designed to streamline customer support operations using Multi-Agent AI architecture, Retrieval-Augmented Generation (RAG), and intelligent ticket management.

---

## 🚀 Project Overview

This platform automates customer query resolution by integrating:

* AI-powered ticket analysis
* Multi-agent workflow handling
* RAG-based document retrieval
* Intelligent response generation
* Gmail integration
* SLA monitoring
* Sentiment analysis
* Priority prediction
* Real-time dashboard analytics

The system helps enterprises reduce manual workload, improve response times, and enhance customer support efficiency.

---

# ✨ Features

## 🤖 AI-Powered Ticket Automation

* Automatic ticket categorization
* AI-generated ticket summaries
* Intelligent response suggestions
* Sentiment detection
* Priority classification

---

## 🧠 Multi-Agent AI Workflow

Different AI agents handle:

* Ticket analysis
* Knowledge retrieval
* Email generation
* Query summarization
* Escalation handling

---

## 📚 RAG (Retrieval-Augmented Generation)

* PDF knowledge base ingestion
* Semantic search using vector embeddings
* Context-aware AI responses
* ChromaDB vector storage

---

## 📧 Gmail Integration

* Email synchronization
* AI-generated email replies
* Ticket creation from emails

---

## 📊 Dashboard & Analytics

* Ticket statistics
* Resolution tracking
* SLA monitoring
* Sentiment insights
* Department-wise analytics

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

---

## Backend

* FastAPI
* Python
* SQLAlchemy
* SQLite

---

## AI / ML

* LangChain
* HuggingFace Embeddings
* Sentence Transformers
* ChromaDB
* RAG Pipeline

---

## APIs & Integrations

* Gmail API
* REST APIs

---

# 🏗️ System Architecture

```text
User Query / Email
        ↓
Frontend Portal (React)
        ↓
FastAPI Backend
        ↓
Multi-Agent AI Workflow
 ├── Ticket Analyzer Agent
 ├── RAG Retrieval Agent
 ├── Response Generator Agent
 ├── Sentiment Analysis Agent
 └── Escalation Agent
        ↓
Vector Database (ChromaDB)
        ↓
Knowledge Base PDFs
```

---

# 📂 Project Structure

```text
Multi-Agent Intelligent Customer Query Resolution Platform
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── docs/
│   └── chroma_db/
│
├── conversadesk/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── assets/
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/21anubhav/Multi-Agent-Intelligent-Customer-Query-Resolution-Platform.git
```

---

## 2️⃣ Frontend Setup

```bash
cd conversadesk

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# 📚 RAG Knowledge Base Setup

Place PDF files inside:

```text
backend/app/docs/
```

Then create vector database:

```bash
python
```

```python
from app.services.rag_service import build_rag

build_rag()
```

---

# 🔐 Environment Variables

Create `.env` file inside backend:

```env
OPENAI_API_KEY=your_api_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

# 📸 Screenshots

Add screenshots here:

```text
screenshots/dashboard.png
screenshots/tickets.png
screenshots/chatbot.png
```

---

# 🎯 Key Functionalities

* AI Ticket Classification
* Smart Email Automation
* Multi-Agent Query Resolution
* Enterprise Knowledge Retrieval
* Real-Time Ticket Monitoring
* SLA Tracking
* Semantic Search
* AI Response Suggestions

---

# 🧪 Future Enhancements

* Voice-to-Ticket Conversion
* WhatsApp Integration
* Azure OpenAI Integration
* Multi-language Support
* Docker Deployment
* Kubernetes Scaling
* Advanced Analytics Dashboard

---

# 👨‍💻 Author

**Anubhav Pathania**

AI/ML & Full Stack Developer

---

# 📄 License

This project is developed for educational and enterprise AI automation purposes.
