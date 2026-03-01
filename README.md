# HealthAI Dashboard

A real-time AI-powered health analytics dashboard with intelligent insights, symptom checking, and prediction history.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide React
- **Backend**: Express.js, SQLite (better-sqlite3), WebSockets, JWT Auth
- **Build Tool**: Vite

*Note: The backend was implemented in Node.js (Express + SQLite) instead of Python (FastAPI + SQLAlchemy) to run seamlessly within this full-stack JavaScript environment. Recharts was used instead of Chart.js following the platform's library guidelines.*

## Features
- **Symptom Intelligence Panel**: Search and select symptoms to get real-time AI disease predictions.
- **Prediction History Analytics**: View past predictions with filtering and pagination.
- **AI Health Analytics**: Real-time charts showing risk distribution, prediction trends, disease frequency, and AI confidence.
- **AI Insight Engine**: Automatically generated insights based on prediction data.
- **Real-Time Updates**: WebSockets broadcast new predictions to all connected clients instantly.

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t healthai-dashboard .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 healthai-dashboard
   ```
3. Open your browser and navigate to `http://localhost:3000`.
