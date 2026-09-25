# OVARIAN DISEASES ANALYZER
### AI-Assisted Ovarian Ultrasound Analysis System

---

## 📌 Overview
**Ovarian Diseases Analyzer** is a full-stack, end-to-end academic AI decision-support system designed to classify ovarian ultrasound images into **5 categories** using a trained **ResNet18** deep convolutional neural network (`resnet18.pkl`). The system provides **Grad-CAM** visual explainability overlays, probability distributions, patient management, and downloadable PDF reports generated via **ReportLab**.

---

## 🛠️ Features

1. **Deterministic ResNet18 AI Inference**:
   - Pre-trained ResNet18 architecture loaded directly from `resnet18.pkl`.
   - Classifies 5 ovarian conditions:
     - `0`: `complex_cyst`
     - `1`: `dominant_follicle`
     - `2`: `healthy`
     - `3`: `poly_cyst`
     - `4`: `simple_cyst`
   - Strict 224x224 RGB image normalization with ImageNet mean/std.

2. **Grad-CAM Explainability (XAI)**:
   - Visualizes feature activation heatmaps from ResNet18 `layer4` conv layer.
   - Blends spatial heatmaps with original ultrasound images.

3. **PDF Diagnostic Report Generation**:
   - Generates downloadable clinical PDF reports via ReportLab.
   - Includes patient metadata, prediction metrics, probability tables, side-by-side ultrasound/Grad-CAM images, factual summaries, and safety disclaimers.

4. **Patient Management & History**:
   - Unique patient code generation (e.g. `PAT-0001`).
   - Patient search filtering, diagnostic history log, and PDF report re-downloads.

5. **Authentication & Security**:
   - User registration and login powered by **JWT Bearer Authentication** and **Bcrypt** password hashing.
   - Strict user-level data isolation.

---

## 💻 Technology Stack

- **Frontend**: React 18, Vite, React Router, Axios, Lucide Icons, Glassmorphic Modern CSS
- **Backend**: Python 3.12, FastAPI, Uvicorn, SQLAlchemy, Pydantic
- **AI / Deep Learning**: PyTorch, Torchvision, ResNet18, OpenCV, NumPy, PIL
- **Database**: SQLite 3 (`ovarian_analyzer.db`)
- **PDF Generation**: ReportLab
- **Security**: PyJWT, Bcrypt

---

## 📂 Project Structure

```
Ovarian-Diseases-Analyzer/
├── backend/
│   ├── app/
│   │   ├── ai/               # Model loader, predictor, preprocessing, Grad-CAM
│   │   ├── core/             # Configuration & Security (JWT, bcrypt)
│   │   ├── database/         # SQLAlchemy engine & models
│   │   ├── models/           # Model entity wrappers
│   │   ├── routes/           # Auth, patients, analysis, reports API
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Auth, patient, analysis & PDF report services
│   │   └── main.py           # FastAPI entry point
│   ├── database/             # SQLite DB file (ovarian_analyzer.db)
│   ├── models/               # resnet18.pkl model checkpoint
│   ├── uploads/              # Saved ultrasound scans & Grad-CAM heatmaps
│   ├── reports/              # Generated PDF reports
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, UploadBox, Cards, Charts, GradCAMViewer
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useAuth
│   │   ├── pages/            # Login, Register, Dashboard, Patients, NewAnalysis, Result, History
│   │   ├── services/         # Axios API clients
│   │   ├── utils/            # Helper utilities
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── docs/                     # Architecture, API, and DB documentation
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=ovarian_disease_analyzer_secret_jwt_key_2026_academic_project
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./database/ovarian_analyzer.db
MODEL_PATH=./models/resnet18.pkl
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Installation & Running

### 1. Backend Setup & Startup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server with Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend server will run at: `http://localhost:8000`  
Swagger API Docs available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup & Startup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend application will run at: `http://localhost:5173`

---

## 🧪 Quick Test Workflow

1. Open `http://localhost:5173` in your browser.
2. Click **Register** and create a new clinician account.
3. Login using your email and password.
4. On the **Dashboard**, click **Add New Patient** and create a patient record.
5. Click **New Analysis**, select the patient, upload an ovarian ultrasound image (`.jpg` or `.png`), and click **Run AI Ultrasound Analysis**.
6. View the real-time **ResNet18 prediction**, **confidence score**, **probability chart**, and **Grad-CAM heatmap**.
7. Click **Download PDF Report** to save the generated report.
8. Navigate to **Analysis History** to view past diagnostic records and re-download PDF reports.

---

## ⚠️ Medical Safety & Disclaimer

This application is an **academic AI decision-support system** built for research and educational purposes.  
- Model predictions represent statistical probability estimates and **do NOT constitute a confirmed medical diagnosis**.
- Grad-CAM heatmaps highlight feature activation regions and are **NOT automated medical segmentation masks**.
- Always consult a certified radiologist or gynecologist for medical diagnostic decisions.
