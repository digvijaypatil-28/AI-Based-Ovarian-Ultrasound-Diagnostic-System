# Project Architecture - Ovarian Diseases Analyzer

## Overview
The **Ovarian Diseases Analyzer** is an AI-assisted decision-support system designed to classify ovarian ultrasound images into 5 categories using a pre-trained **ResNet18** deep convolutional neural network and generate visual **Grad-CAM** explainability overlays alongside PDF diagnostic reports.

---

## Technical Stack Architecture

```
                      +-----------------------------+
                      |    React 18 + Vite UI       |
                      |   (Dashboard, Charts, PDF)  |
                      +--------------+--------------+
                                     |
                                REST API (JWT)
                                     v
                      +--------------+--------------+
                      |      FastAPI Backend        |
                      +--------------+--------------+
                                     |
          +--------------------------+--------------------------+
          |                          |                          |
          v                          v                          v
  +---------------+          +---------------+          +---------------+
  | ResNet18 PyTorch|        | Grad-CAM Engine|        | ReportLab PDF |
  | (resnet18.pkl) |        | (Layer4 Heatmap)|       | (PDF Reports) |
  +---------------+          +---------------+          +---------------+
          |                          |                          |
          +--------------------------+--------------------------+
                                     |
                                     v
                      +--------------+--------------+
                      |    SQLite + SQLAlchemy      |
                      |  (ovarian_analyzer.db)      |
                      +-----------------------------+
```

---

## Core Components

### 1. Frontend (React 18 + Vite)
- **State Management**: `AuthContext` for JWT authentication and session state.
- **HTTP Client**: Axios with request/response interceptors for automatic Bearer token management.
- **Routing**: `react-router-dom` with `ProtectedRoute` navigation guards.
- **Components**:
  - `Navbar` & `Sidebar`: Core navigation shell.
  - `UploadBox`: Drag-and-drop ultrasound image upload with real-time format validation & preview.
  - `PredictionCard`: Top condition display with confidence score.
  - `ProbabilityChart`: Class probability distribution bar chart.
  - `GradCAMViewer`: Side-by-side original ultrasound vs. Grad-CAM visual heatmap overlay.

### 2. Backend (FastAPI + PyTorch)
- **Model Loader (`model_loader.py`)**: Singleton container loading `backend/models/resnet18.pkl` onto CPU or CUDA device.
- **Predictor (`predictor.py`)**: Executes evaluation-mode forward pass on standard 224x224 normalized image tensors.
- **Grad-CAM (`gradcam.py`)**: Computes feature map gradients on ResNet18 `layer4` convolution, generates JET colormap overlay, and blends heatmap with original image.
- **Report Service (`report_service.py`)**: Generates structured PDF reports containing patient metrics, prediction results, probability breakdown, visual overlays, clinical findings summary, and safety disclaimers.
- **Security (`security.py`)**: Passwords hashed with native `bcrypt`; user authentication secured via `PyJWT`.
