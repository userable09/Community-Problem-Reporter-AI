# 🏙️ Community Problem Reporter AI

**Empowering Citizens to Report, Track, and Resolve Neighborhood Issues.**

Community Problem Reporter AI is a full-stack, AI-powered civic engagement platform designed to bridge the gap between everyday citizens and municipal authorities. By leveraging advanced generative AI models (Groq Llama-3.3 / Gemini API), interactive geospatial mapping (Leaflet), and local-first browser storage, citizens can effortlessly transform informal issue descriptions into professional, administrative municipal complaint letters while tracking community issues in real time.

---

## 📸 Application Screenshots

<p align="center">
  <img src="./Screenshot%202026-07-27%20154838.png" alt="Application Overview Dashboard" width="100%" />
</p>

<p align="center">
  <img src="./Screenshot%202026-07-27%20165003.png" alt="Interactive Geospatial Community Map" width="100%" />
</p>

<p align="center">
  <img src="./Screenshot%202026-07-27%20165019.png" alt="AI Problem Analyzer & Municipal Letter Generator" width="100%" />
</p>

---

## ✨ Key Features

### 📝 1. Smart Problem Reporting
- **Category-Driven Input**: Report issues across standard municipal categories including *Road Damage (Potholes)*, *Water Leaks & Plumbing*, *Street Lighting & Electrical*, *Sanitation & Waste*, *Public Safety & Vandalism*, *Traffic & Parking*, *Illegal Dumping*, and *Park & Green Space Maintenance*.
- **GPS Location Detection**: Auto-detect current coordinates using browser Geolocation API or manually enter precise addresses/cross streets.
- **Photo Upload & Preview**: Attach visual evidence directly with instant client-side image preview and validation.
- **Auto AI Analysis Toggle**: Instantly analyze issues upon submission to extract urgency, department assignments, and initial complaints.

### 🤖 2. AI Problem Analyzer & Municipal Complaint Generator
- **AI Executive Summary**: Generates clear, concise 2-sentence summaries for city administrators.
- **Grammar Correction & Administrative Rewrite**: Elevates informal user descriptions into formal, professional administrative language suitable for municipal archives.
- **Urgency & Department Matrix**:
  - Calculates a precise **Urgency Score (1–100)** based on hazard risk, public impact, and time sensitivity.
  - Assigns priority levels (*Critical*, *High*, *Medium*, *Low*).
  - Matches the issue to the exact municipal authority (e.g., *Department of Transportation*, *Bureau of Water Supply*, *Public Works*).
  - Estimates realistic resolution timeframes in days.
- **Actionable AI Solutions & Risk Factors**: Highlights key hazard risks and recommends proactive municipal remediation steps.
- **Formal Complaint Letter Generation**:
  - Automatically drafts a formal legal/administrative complaint letter addressed to city officials.
  - Supports custom target authority refinement (e.g., "Office of the City Mayor", "District Engineer").
  - One-click copy, browser print formatting, and **PDF / DOCX exports**.

### 🗺️ 3. Interactive Community Geospatial Map
- **Leaflet Integration**: Renders real-time community issues on an interactive map using custom tile layers.
- **Color-Coded Priority Pins**: Visualizes issue urgency with distinct color pins (*Rose = Critical*, *Amber = High*, *Blue = Medium*, *Emerald = Low*).
- **Interactive Modals & Filters**: Filter pins dynamically by category or priority level and open detail popups with direct links to AI breakdowns.

### 📋 4. Issue History & Status Tracking
- **Multi-Parametric Search & Filtering**: Instant search across titles, locations, and reference IDs with filters for category, priority, and status.
- **Status Lifecycle Management**: Transition reports through official statuses (*Pending* ➔ *In Review* ➔ *In Progress* ➔ *Resolved* ➔ *Dismissed*).
- **In-Line Modal Editing & Deletion**: Update report details or delete resolved entries with confirm modals.

### 🤖 5. CivicBot AI Citizen Assistant
- **24/7 AI Guidance**: Answers questions regarding municipal jurisdictions, reporting procedures, tenant rights, and city services.
- **Quick-Prompt Suggestions**: One-tap access to common citizen queries.

### 🚨 6. 24/7 Emergency Contacts Directory
- Direct access to essential dispatch helplines (*Emergency Dispatch*, *Gas & Fire Hazard*, *Water & Sewer Main*, *Electrical Grid Safety*, *Non-Emergency Police*, *Animal Control*).
- One-click direct calling (`tel:`) and phone number copy actions.

### ⚙️ 7. Theme Modes & Local-First Storage
- **Glassmorphic Modern UI**: Designed with frosted glass panels, ambient emerald glowing highlights, dark mode gradients, and clean typography.
- **Light & Dark Theme Toggle**: Switch seamlessly between frosted dark mode and crisp light mode.
- **Zero Mandatory Backend**: Operates with browser `localStorage`, ensuring complete data privacy without requiring external user logins or cloud databases.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool & Bundler**: Vite 6 + Express custom server with `esbuild`
- **Styling & Design System**: Tailwind CSS v4, Lucide React Icons
- **Animations**: Motion (`motion/react`)
- **Maps**: Leaflet (`leaflet`, `@types/leaflet`)
- **AI Integrations**: Server-side Google GenAI SDK (`@google/genai`) & optional client Groq API integration
- **Styling & Assets**: Google Fonts (Plus Jakarta Sans, Playfair Display)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your system.

### Installation

1. **Clone or Download the Repository**:
   ```bash
   git clone <repository-url>
   cd community-problem-reporter-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   # Server-side Gemini API key for AI analysis & CivicBot
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:3000`.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts the Express + Vite development server on port 3000 |
| `build` | `npm run build` | Builds the client assets with Vite and bundles `server.ts` with esbuild into `dist/server.cjs` |
| `start` | `npm run start` | Runs the compiled production server (`node dist/server.cjs`) |
| `lint` | `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `clean` | `npm run clean` | Removes build output directories (`dist`, `server.cjs`) |

---

## 📁 Project Structure

```
.
├── server.ts                    # Express server entry point with Vite middleware & API proxy
├── src/
│   ├── main.tsx                 # React application entry point
│   ├── App.tsx                  # Root component with tab navigation & header
│   ├── index.css                # Global Tailwind CSS imports & custom animations
│   ├── types.ts                 # Global TypeScript interfaces, types & initial sample data
│   ├── components/
│   │   ├── LandingPage.tsx      # Public landing page with hero, statistics & FAQ
│   │   ├── ReportProblemForm.tsx# Citizen problem submission form with GPS & photos
│   │   ├── AIProblemAnalyzer.tsx# AI urgency breakdown & municipal letter generator
│   │   ├── CommunityMap.tsx     # Interactive Leaflet geospatial map view
│   │   ├── IssueHistory.tsx     # Filterable issue history log & status manager
│   │   ├── AIChatbot.tsx        # CivicBot AI citizen assistant chat
│   │   ├── EmergencyContacts.tsx# 24/7 emergency contacts & dispatch directory
│   │   └── SettingsPage.tsx     # Theme toggles, API key config & local data reset
│   └── lib/
│       ├── aiService.ts         # Groq / Gemini AI analysis & letter prompt handlers
│       └── documentExport.ts    # Browser print, PDF, and DOCX document generators
├── Screenshot 2026-07-27 154838.png   # Application UI screenshot 1
├── Screenshot 2026-07-27 165003.png   # Interactive Community Map screenshot
├── Screenshot 2026-07-27 165019.png   # AI Analysis & Letter Generator screenshot
├── metadata.json                # Applet configuration & frame permissions
├── package.json                 # Dependencies and build scripts
└── README.md                    # Project documentation
```

---

## 🔒 Privacy & Data Policy

- **Local Storage First**: All reported issues, custom settings, and status updates are persisted strictly inside your browser's `localStorage`.
- **No Unsolicited Tracking**: No personal tracking scripts, advertising SDKs, or external user registration databases are used.

---

## 📄 License

Distributed under the MIT License. Built for civic empowerment, public safety, and community development.
