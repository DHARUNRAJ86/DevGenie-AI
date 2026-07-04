# DevGenie AI 🤖

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/REST%20API-JWT%20Secured-FF6C37?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</p>

<p align="center">
  <strong>An enterprise-grade Multi-Agent AI system that serves as an interactive developer workspace — 
  assisting with code generation, bug fixing, performance optimization, and real-time code execution.</strong>
</p>

---

## 🎯 Project Overview

DevGenie AI is a production-quality **Agentic AI** developer workspace built with a **React** frontend and a **Node.js/Express/MongoDB** backend. It goes far beyond a simple chat wrapper — it implements a complete multi-agent system that:

1. **Understands developer goals** — Contextualizes requests across specialized agents (Write Code, Debug Errors, Review Code, Optimize)
2. **Executes code in real-time** — Implements a secure, integrated JavaScript/TypeScript Playground with live console evaluation
3. **Features development utilities** — Offers interactive mini-apps including a Markdown Live Previewer and an interactive Regex Tester
4. **Maintains secure history** — Integrates session management, pinning, renaming, and security tracking powered by JWT and MongoDB
5. **Adapts to workspace aesthetics** — Offers a premium, themeable interface supporting full Dark and Light modes

---

## 🏗️ Enterprise Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DevGenie AI System                         │
│ ├──────────────┬──────────────────────────────────────────────────┤
│ │              │         AI Agent Router                          │
│ │   Frontend   │  ┌─────────────┐    ┌──────────────────────┐     │
│ │              │  │  Multi-Agent│    │   Agent Router API   │     │
│ │  Workspace   │→ │  Interface  │ →  │   (LLM Gateway)      │ →   │
│ │  Playground  │  │  + Context  │    │   Structured JSON    │     │
│ │  Mini-Apps   │  └─────────────┘    └──────────────────────┘     │
│ │              │         ↓                                        │
│ │              │  ┌─────────────────────────────────────┐         │
│ │              │  │  DevGenie Utilities Engine          │         │
│ │              │  │  JS / TS Playground Exec            │         │
│ │              │  │  Regex Highlight Matcher            │         │
│ │              │  │  Markdown Live Parser               │         │
│ │              │  └─────────────────────────────────────┘         │
│ │              │         ↓                                        │
│ │              │  ┌──────────────┐    ┌───────────────────┐       │
│ │              │  │  Express API │    │  MongoDB Database │       │
│ │              │  │  REST Gateway│ ←→ │  Mongoose Models  │       │
│ │              │  │  JWT Secure  │    │  Session History  │       │
│ │              │  └──────────────┘    └───────────────────┘       │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 🚀 Key Features & Workspace Capabilities

| Feature | Technology | Description |
|---|---|---|
| **Multi-Agent Workspace** | LLM Integration + System Instructions | Specialized agents for generating code, debugging exceptions, reviewing quality, and optimizing loops |
| **Real-time Playground** | JS Evaluation Context | Runs JavaScript and TypeScript snippets in real-time with standard out logs captured to a virtual console |
| **Markdown Previewer** | Live Regex Parser | Renders markdown syntax including headers, list items, and code highlights live |
| **Regex Tester** | Dynamic Highlight Engine | Tests and highlights regular expression matches instantly across input text |
| **Workspace Management** | Node.js + MongoDB Mongoose | Organizes developer projects, session limits, and lines of code generated |
| **JWT Session Security** | JWT + BCrypt | Authenticated session access protecting chat streams, profile history, and project configuration |
| **Premium Theme Engine** | HSL CSS Variable Themes | Seamless transition between rich glassmorphic dark mode and a high-contrast clean light mode |

---

## 🛠️ Tech Stack & Production Standards

* **Frontend:** React 18, React Router v6, Context API, Lucide Icons, Vanilla CSS (Glassmorphism & Variables)
* **Backend:** Node.js, Express, Mongoose ODM
* **LLM Engine:** Multi-agent pipeline with structured system contexts
* **Database:** MongoDB 6.0+, Mongoose Schema Validation
* **Security:** JSON Web Tokens (JWT), BCrypt Password Hashing, CORS middleware
* **DevOps:** Local dev servers, environment config

---

## 💻 Local Development Setup

### Prerequisites
* Node.js 18.x or higher
* MongoDB running locally or a MongoDB Atlas URI

### 1. Database Configuration
Ensure MongoDB is running locally at `mongodb://localhost:27017/` or obtain a MongoDB Atlas URI.

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` root:
   ```env
   PORT=5000
   MONGO_URI=YOUR_MONGO_URI_OR_LOCAL_CONNECTION_STRING
   JWT_SECRET=YOUR_JWT_SECRET_KEY
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ License

This project is licensed under the MIT License.