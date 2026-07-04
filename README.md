# ```
██████╗ ███████╗██╗   ██╗ ██████╗ ███████╗███╗   ██╗██╗███████╗     █████╗ ██╗
██╔══██╗██╔════╝██║   ██║██╔════╝ ██╔════╝████╗  ██║██║██╔════╝    ██╔══██╗██║
██║  ██║█████╗  ██║   ██║██║  ███╗█████╗  ██╔██╗ ██║██║█████╗      ███████║██║
██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║██╔══╝  ██║╚██╗██║██║██╔══╝      ██╔══██║██║
██████╔╝███████╗ ╚████╔╝ ╚██████╔╝███████╗██║ ╚████║██║███████╗    ██║  ██║██║
╚═════╝ ╚══════╝  ╚═══╝   ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝
```

## Next-Generation Multi-Agent AI Developer Workspace

```
User Prompt │ ▼ ┌──────────────────────────────────────────────┐ │ STEP 1 · AGENT SELECTION │ │ Code / Debug / Review / Optimize │ │ JWT Auth Validation & Session Sync │ └─────────────────────┬────────────────────────┘ │ ▼ ┌──────────────────────────────────────────────┐ │ STEP 2 · CONTENT PROCESSING │ │ Markdown / Regex / File attachments │ │ System role binding & query construct │ └─────────────────────┬────────────────────────┘ │ ▼ ┌──────────────────────────────────────────────┐ │ STEP 3 · LLM CALL ( Local/Groq/Cloud ) │ │ Context window assembly (Session History) │ │ Token limits check & prompt validation │ └─────────────────────┬────────────────────────┘ │ ▼ ┌──────────────────────────────────────────────┐ │ STEP 4 · RESPONSE & PERSIST │ │ Live Markdown rendering + syntax highlight │ │ Session history updated in MongoDB │ └──────────────────────────────────────────────┘
```

```
╔══════════════════════════════════════════╗
║     BLOCK 1 · MULTI-AGENT HANDLERS       ║
║  code-gen · debugger · reviewer · optim  ║
╠══════════════════════════════════════════╣
║     BLOCK 2 · LIVE DEV WORKSPACE         ║
║  real-time javascript/ts playground      ║
╠══════════════════════════════════════════╣
║     BLOCK 3 · UTILITIES ENGINE           ║
║  regex tester · markdown live preview    ║
╠══════════════════════════════════════════╣
║     BLOCK 4 · SECURE SESSION DATABASE    ║
║  history storage · pin/rename via Mongo  ║
╚══════════════════════════════════════════╝
```

### Features

- 💻 **Multi-Agent Mode Switcher**: Instantly toggle between Write Code, Debug Errors, Review Code, and Optimize modes.
- ⚡ **Real-Time Playground**: Run and test JavaScript/TypeScript snippets on the fly with live console output.
- 🎨 **Adaptive Theme System**: Immersive Dark and Light modes styled with smooth transitions and premium color palettes.
- 📁 **Workspace Management**: Organise developer workspaces, track lines generated, and chat contextually about specific projects.
- 🔍 **Mini Apps**: Built-in developer tools including a Regex Tester with live match highlighting and a Markdown Previewer.

### Technology Stack

- **Frontend**: React, React Router, Lucide Icons, Context API
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Styling**: Vanilla CSS with custom theme variables
- **Auth**: JWT Authentication

### Getting Started

#### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DHARUNRAJ86/DevGenie-AI.git
   cd DevGenie-AI
   ```

2. Setup Backend Server:
   ```bash
   cd server
   npm install
   # Create a .env file with PORT, MONGO_URI, and JWT_SECRET
   npm start
   ```

3. Setup Frontend Client:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```