# NEXORA: Next-Generation Nuclear Infrastructure Intelligence in Kenya

An AI-powered decision platform helping the Republic of Kenya assess, plan, and deploy Small Modular Reactors (SMRs) with precision, confidence, and international standards alignment. The platform is designed specifically around the IAEA Nuclear Infrastructure Milestones Approach and tailored to the Kenyan administrative, regulatory, and geological landscape.

---

## Executive Summary

Kenya is exploring Small Modular Reactors (SMRs) to secure carbon-free baseload power to meet its rapidly growing industrial and municipal electricity demand. However, transitioning to a nuclear state requires addressing complex infrastructure, regulatory, financial, and stakeholder alignment challenges.

NEXORA provides a comprehensive, AI-driven SaaS platform that objectively evaluates Kenya's readiness. Using natural language processing, deterministic scoring algorithms, and the IAEA's 19 infrastructure issues, NEXORA synthesizes complex macroeconomic, regulatory, and public sentiment data into actionable roadmaps. It serves as a unified system of intelligence for state organizations, including the Ministry of Energy, the Kenya Nuclear Power and Energy Agency (NuPEA), and the Nuclear Regulatory Authority (KNRA).

---

## Core Modules

### 1. Nuclear Readiness Index
A deterministic scoring engine that evaluates the 19 IAEA infrastructure issues (Governance, Regulatory, Technical, Institutional). It applies proprietary SMR-specific weighting factors to generate a Readiness Grade (A+ to F), Risk Level, and visual domain breakdowns (Human Resources, Financing, Stakeholders, Infrastructure, and Policies & Regulation) using Radar and Gauge charts.

### 2. Human Resource Intelligence
Estimates national workforce requirements for a 300 MW SMR program. Evaluates current capacity vs. required capacity across nuclear engineering, project management, and safety inspections, and generates targeted upskilling strategies. It maps programs to target educational institutions such as the University of Nairobi, Jomo Kenyatta University of Agriculture and Technology (JKUAT), and Technical Training Institutes (TTIs).

### 3. Financing Intelligence
Models financing structures based on Kenya's national budget and GDP. It implements the **Kenya 300 MW SMR Reference Case** ($4.80B estimated project cost, LCOE projections, and a 70/30 debt-to-equity financing structure utilizing Export Credit Agency loans, DFI concessional loans, sovereign equity, and utility/strategic equity).

### 4. Stakeholder & PR Intelligence
Utilizes NLP models to parse news articles, public surveys, and NGO statements. It builds a **Power-Interest Matrix** mapping key Kenyan stakeholders (Ministry of Energy, NuPEA, NEMA, KPLC, host communities) based on sentiment and influence, and suggests tailored engagement activities to address localized concerns, such as Rift Valley seismic activity and radioactive waste management.

### 5. Country Benchmarking
Benchmarks Kenya's infrastructure readiness against peer nations including Turkey, Bangladesh, Egypt, India, and Uzbekistan. It extracts strategic recommendations and global best practices from successful SMR adopter states to optimize Kenya's development timeline.

### 6. IAEA Milestone Engine & Roadmap Generator
Tracks deliverables across the three main IAEA Milestone phases. It generates a comprehensive multi-year execution roadmap detailing critical-path tasks (such as passage of the draft Nuclear Regulatory Bill and site selection clearance) and assigns them to responsible government and public sector organizations.

### 7. Executive Reports
A backend WeasyPrint engine dynamically compiles all intelligence modules into a professional, board-ready A4 PDF report perfect for executive leadership and IAEA review missions.

---

## Technical Architecture

NEXORA is built on a modern, robust, and highly scalable stack:

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, Chart.js, Framer Motion, Lucide Icons
- **Backend:** FastAPI, Python 3.12, SQLAlchemy 2.0 (Async), Alembic, Pydantic, WeasyPrint
- **Database:** PostgreSQL (with AsyncPG driver for high-concurrency)
- **AI Engine:** Google Gemini (Generative AI & Structured JSON Output)
- **DevOps:** Docker, Docker Compose, GitHub Actions, Vercel, Render

---

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or later)
- Python 3.12+
- API Key from Google AI Studio (Gemini)

### Running the Platform

To experience the full platform (including State Persistence, Collaborative Save, and PDF Report Generation), you should run both the frontend and backend servers.

#### 1. Configure your environment
Create an `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 2. Run the Next.js Frontend
Open a terminal in the root directory:
```bash
# Install packages
npm install

# Start Next.js development server
npm run dev
```
*The frontend UI will run at [http://localhost:3000](http://localhost:3000).*

#### 3. Run the FastAPI Backend
Open a second terminal in the root directory:
```bash
# Activate the virtual environment
venv\Scripts\activate      # Windows powershell/cmd
# or: source venv/bin/activate  # Unix/macOS

# Install backend python dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server via Uvicorn
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The API server will run at [http://localhost:8000](http://localhost:8000) and automatically configure the SQLite database (`nexora.db`) at startup.*

---

## Production Deployment

NEXORA is configured for automated deployment to **Render** using the unified Infrastructure-as-Code blueprint (`render.yaml`).

### Deploying using Render Blueprint
1. Go to the **Render Dashboard**, select **New +** and click on **Blueprint**.
2. Connect your GitHub repository.
3. Render will automatically detect `render.yaml` and offer to provision:
   - Managed **PostgreSQL Database** (`nexora-db`)
   - FastAPI Python Web Service (`nexora-backend`)
   - Next.js Node Web Service (`nexora-frontend`)
4. Input your `GEMINI_API_KEY` when prompted by Render during the initial blueprint configuration.
5. Click **Apply** to deploy the entire stack!

*(Note: The Next.js frontend is configured to talk to the backend via `NEXT_PUBLIC_API_URL`, which is dynamically injected by the Render blueprint.)*
