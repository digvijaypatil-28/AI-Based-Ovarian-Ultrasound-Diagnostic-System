# OVARIAN DISEASES ANALYZER
## Comprehensive Technical Documentation & Project Defense Guide

---

## SECTION 1 — PROJECT OVERVIEW

### 1. What is Ovarian Diseases Analyzer?
**Ovarian Diseases Analyzer** is an end-to-end, full-stack, AI-assisted decision-support system designed to classify pelvic ultrasound scans into 5 clinical categories using a pre-trained **ResNet18** deep convolutional neural network (CNN). The application provides visual explainability through **Grad-CAM** (Gradient-weighted Class Activation Mapping) heatmaps and generates downloadable **PDF reports** using ReportLab.

### 2. What Problem Does It Solve?
Manual interpretation of ovarian ultrasound images requires significant clinical expertise. Subtle acoustic variations between different cystic structures (such as simple cysts, complex cysts, or polycystic patterns) can be challenging to differentiate quickly. This system assists clinicians and students by providing rapid, objective, probability-based image classification and visual feature heatmaps.

### 3. Why Ovarian Ultrasound Images Are Used?
Pelvic ultrasound is the primary, non-invasive imaging modality for evaluating ovarian morphology. It is cost-effective, widely available, and safe (using sound waves rather than ionizing radiation).

### 4. What Role Does AI Play?
The AI system acts as a **feature extractor and pattern classifier**. It takes raw pixel values from an ultrasound image, extracts spatial features through 18 convolutional layers, and computes a probability distribution across 5 diagnostic categories.

### 5. What is the Purpose of the Application?
The purpose is to serve as an **educational and clinical decision-support reference**. It is NOT designed to provide an autonomous or confirmed medical diagnosis.

### 6. Who Can Use the System?
- **Healthcare Professionals / Clinicians**: To view AI classification probabilities and visual Grad-CAM feature attention maps.
- **Medical & CS Students / Researchers**: To study deep learning application in medical imaging and explainable AI (XAI).

### 7. What is the Final Workflow?
`Clinician Login` $\rightarrow$ `Dashboard` $\rightarrow$ `Register / Select Patient` $\rightarrow$ `Upload Ultrasound Scan` $\rightarrow$ `ResNet18 Model Inference` $\rightarrow$ `Grad-CAM Heatmap Generation` $\rightarrow$ `Database Persistence` $\rightarrow$ `Interactive Result Screen` $\rightarrow$ `Downloadable PDF Report`.

---

### 🎙️ Viva Pitch: "What is your project?" (5-8 Sentences)
> "My project is the **Ovarian Diseases Analyzer**, an AI-assisted decision-support web application for classifying pelvic ultrasound scans into five categories: Complex Cyst, Dominant Follicle, Healthy Ovarian Tissue, Polycystic Ovary (PCOS), and Simple Cyst. The system is built using a **React 18** frontend and a **FastAPI** Python backend. At its core, it loads a pre-trained **ResNet18** deep learning model to perform deterministic image classification and computes exact probability distributions. To make the AI transparent, it implements **Grad-CAM** explainability to overlay visual heatmaps showing which image regions influenced the prediction. Finally, it generates downloadable, professional **ReportLab PDF reports** and persists complete patient diagnostic histories in an **SQLite** database using **SQLAlchemy**."

---

## SECTION 2 — PROBLEM STATEMENT

### Existing Problem
- **Inter-Observer Variability**: Manual ultrasound interpretation depends heavily on clinician experience and image acquisition quality.
- **Visual Overlap**: Ultrasound images of simple fluid-filled cysts, complex solid-cystic masses, and polycystic structures share acoustic textures that can be difficult to quantify visually.
- **AI "Black Box" Problem**: Standard deep learning models output prediction labels without explaining *why* a particular decision was made.

### How Computer Vision & Explainable AI Assist
- **Quantitative Probability Scoring**: Evaluates spatial feature maps to return objective confidence percentages.
- **Visual Explainability (Grad-CAM)**: Highlights spatial regions that contributed most to the model's decision.

### System Boundaries & Non-Diagnostic Disclaimer
> **IMPORTANT SAFETY BOUNDARY**: The system provides **AI-assisted image classification**, NOT a confirmed medical diagnosis. It does NOT independently confirm the presence or absence of lesions or clinical disease. All predictions must be interpreted alongside complete clinical evaluations by certified medical professionals.

---

## SECTION 3 — MAIN FEATURES

| Feature | Purpose | Technology | Where Implemented |
|---|---|---|---|
| **User Authentication** | Secure clinician registration and login with JWT & bcrypt | PyJWT, native Bcrypt, React AuthContext | `backend/app/routes/auth.py`, `frontend/src/context/AuthContext.jsx` |
| **Patient Management** | Register patients, view directory, search, generate unique patient codes (`PAT-0001`) | FastAPI, SQLAlchemy, SQLite, React | `backend/app/routes/patients.py`, `frontend/src/pages/Patients.jsx` |
| **Ultrasound Image Upload** | Drag-and-drop ultrasound upload with file validation & live preview | HTML5 File API, React, PIL | `frontend/src/components/UploadBox.jsx`, `frontend/src/pages/NewAnalysis.jsx` |
| **ResNet18 AI Inference** | Deterministic 5-class ultrasound classification | PyTorch, Torchvision ResNet18 | `backend/app/ai/predictor.py`, `backend/app/ai/model_loader.py` |
| **Image Preprocessing** | RGB conversion, 224x224 resize, ToTensor, ImageNet normalization | Torchvision Transforms, PIL | `backend/app/ai/preprocessing.py` |
| **Probability Breakdown** | Computes 5-class softmax percentage distribution & bar chart rendering | PyTorch Softmax, React, Custom CSS | `backend/app/ai/predictor.py`, `frontend/src/components/ProbabilityChart.jsx` |
| **Grad-CAM Explainability** | Generates feature activation heatmaps overlaying ultrasound scan | PyTorch Hooks, OpenCV, NumPy | `backend/app/ai/gradcam.py`, `frontend/src/components/GradCAMViewer.jsx` |
| **PDF Report Generation** | Creates downloadable PDF analysis reports containing patient data, charts & images | ReportLab Platypus Engine | `backend/app/services/report_service.py`, `backend/app/routes/reports.py` |
| **Diagnostic History Log** | Stores historical scan records per user with view and download actions | SQLAlchemy, SQLite | `backend/app/routes/analysis.py`, `frontend/src/pages/History.jsx` |
| **Multi-User Data Isolation**| Enforces user-level privacy (User A cannot view User B's data) | SQLAlchemy filtering, FastAPI dependencies | `backend/app/routes/patients.py`, `backend/app/routes/analysis.py` |
| **Session Protection** | Guards routes against unauthenticated access | React Router, `ProtectedRoute.jsx` | `frontend/src/components/ProtectedRoute.jsx` |

---

## SECTION 4 — COMPLETE TECHNOLOGY STACK

| Technology | Category | Where Used | Why It Was Chosen |
|---|---|---|---|
| **React 19** | Frontend UI Framework | `frontend/src/` | Component-based, responsive, declarative UI rendering |
| **Vite 8** | Frontend Build Tool | `frontend/vite.config.js` | Ultra-fast HMR dev server and optimized production bundler |
| **React Router DOM 7** | Frontend Routing | `frontend/src/App.jsx` | Client-side page routing and layout guards |
| **Axios 1.20** | HTTP Client | `frontend/src/services/api.js` | Interceptor-based API calls with Bearer token injection |
| **Lucide React** | Icon System | `frontend/src/components/` | Sleek modern vector icons for medical dashboards |
| **Python 3.12** | Backend Language | `backend/` | Standard language for AI, scientific computing, and Web APIs |
| **FastAPI 0.100+** | Web Framework | `backend/app/main.py` | High-performance async Python framework with automatic OpenAPI docs |
| **Uvicorn** | ASGI Server | Backend launch command | Fast ASGI server to run FastAPI applications |
| **PyTorch 2.0+** | Deep Learning Framework | `backend/app/ai/` | Tensor computation and neural network model execution |
| **Torchvision** | Computer Vision Library | `backend/app/ai/model_loader.py` | Official PyTorch vision models (ResNet18 architecture) |
| **OpenCV Python** | Image Processing | `backend/app/ai/gradcam.py` | JET colormap heatmap generation and image blending |
| **Pillow (PIL)** | Image Processing | `backend/app/ai/preprocessing.py` | Image loading, RGB conversion, and PNG/JPEG formatting |
| **ReportLab 5.0+** | PDF Engine | `backend/app/services/report_service.py` | Programmatic PDF document layout, tables, and styling |
| **SQLite 3** | Database | `backend/database/ovarian_analyzer.db` | Lightweight, zero-configuration embedded relational database |
| **SQLAlchemy 2.0** | Python ORM | `backend/app/database/` | Object-Relational Mapping for database queries |
| **PyJWT** | Security | `backend/app/core/security.py` | JSON Web Token encoding, decoding, and expiration tracking |
| **Bcrypt** | Security | `backend/app/core/security.py` | One-way cryptographic password hashing |

### Installed Libraries (`requirements.txt` & `package.json`)
- **Backend**: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `torch`, `torchvision`, `pillow`, `opencv-python`, `reportlab`, `pyjwt`, `passlib`, `bcrypt`, `python-multipart`, `matplotlib`, `python-dotenv`.
- **Frontend**: `react`, `react-dom`, `react-router-dom`, `axios`, `lucide-react`, `chart.js`, `react-chartjs-2`, `vite`.

---

## SECTION 5 — PROJECT FOLDER STRUCTURE

```
Ovarian-Diseases-Analyzer/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── model_loader.py    # Loads ResNet18 architecture & checkpoint dictionary
│   │   │   ├── predictor.py       # Executes PyTorch inference & formats probabilities
│   │   │   ├── preprocessing.py   # Resizes (224x224), converts RGB, applies ImageNet normalization
│   │   │   └── gradcam.py         # Computes layer4 feature activation heatmaps & overlays
│   │   ├── core/
│   │   │   ├── config.py          # Pydantic environment configuration settings
│   │   │   └── security.py        # Bcrypt hashing & JWT token creation/decoding
│   │   ├── database/
│   │   │   ├── database.py        # SQLAlchemy engine, session maker, get_db dependency
│   │   │   └── models.py          # User, Patient, and Analysis ORM database models
│   │   ├── models/
│   │   │   ├── user.py            # User entity export wrapper
│   │   │   ├── patient.py         # Patient entity export wrapper
│   │   │   └── analysis.py        # Analysis entity export wrapper
│   │   ├── routes/
│   │   │   ├── auth.py            # /auth/register, /auth/login, /auth/me endpoints
│   │   │   ├── patients.py        # /patients GET/POST endpoints
│   │   │   ├── analysis.py        # /analysis/analyze, /analysis/history endpoints
│   │   │   └── reports.py         # /reports/{id}/pdf endpoint
│   │   ├── schemas/
│   │   │   ├── auth.py            # User register/login Pydantic validation schemas
│   │   │   ├── patient.py         # Patient creation/response Pydantic schemas
│   │   │   └── analysis.py        # Analysis response Pydantic schemas
│   │   ├── services/
│   │   │   ├── auth_service.py    # User registration & password check business logic
│   │   │   ├── patient_service.py # Patient CRUD & patient code generator
│   │   │   ├── analysis_service.py# AI inference orchestration & DB saving logic
│   │   │   └── report_service.py  # ReportLab PDF report builder
│   │   └── main.py                # FastAPI app initialization, CORS, static mounts & routes
│   ├── database/                  # SQLite DB storage directory
│   ├── models/                    # resnet18.pkl model file
│   ├── uploads/                   # Uploaded ultrasound scans & Grad-CAM outputs
│   ├── reports/                   # Saved PDF reports
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header navigation bar & user profile link
│   │   │   ├── Sidebar.jsx        # Sidebar navigation link list
│   │   │   ├── ProtectedRoute.jsx # Unauthenticated route guard wrapper
│   │   │   ├── PatientCard.jsx    # Patient summary grid card
│   │   │   ├── UploadBox.jsx      # Drag & drop upload box with preview
│   │   │   ├── PredictionCard.jsx # Top predicted class display & confidence
│   │   │   ├── ProbabilityChart.jsx# 5-class probability distribution bar chart
│   │   │   ├── GradCAMViewer.jsx  # Side-by-side original ultrasound vs Grad-CAM viewer
│   │   │   └── LoadingSpinner.jsx # Animated loading indicator
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # User session state provider
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Custom AuthContext hook
│   │   ├── pages/
│   │   │   ├── Login.jsx          # User sign-in page
│   │   │   ├── Register.jsx       # User registration page
│   │   │   ├── Dashboard.jsx      # System dashboard with patient & scan metrics
│   │   │   ├── Patients.jsx       # Patient directory with search & creation modal
│   │   │   ├── PatientDetails.jsx # Individual patient record & scan history
│   │   │   ├── NewAnalysis.jsx    # Ultrasound upload & AI analysis studio
│   │   │   ├── AnalysisResult.jsx # Detailed result view with chart, Grad-CAM & PDF
│   │   │   ├── History.jsx        # Complete diagnostic history log
│   │   │   └── Profile.jsx        # User profile & model specs page
│   │   ├── services/
│   │   │   ├── api.js             # Axios client with Bearer token interceptor
│   │   │   ├── authService.js     # Auth API call wrappers
│   │   │   ├── patientService.js  # Patient API call wrappers
│   │   │   ├── analysisService.js # Analysis API call wrappers
│   │   │   └── reportService.js   # PDF download file blob helper
│   │   ├── utils/
│   │   │   └── helpers.js         # Formatting helpers for text, badges & dates
│   │   ├── App.jsx                # React Router layout & routes definition
│   │   ├── index.css              # Global styling & glassmorphism theme tokens
│   │   └── main.jsx               # Vite React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── docs/                          # Technical documentation folder
└── README.md
```

---

## SECTION 6 — COMPLETE SYSTEM ARCHITECTURE

```
                  +-----------------------------------+
                  |        USER / CLINICIAN           |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |    React 19 Frontend (Vite)       |
                  | (Dashboard, Upload, Charts, XAI)  |
                  +-----------------+-----------------+
                                    |
                         HTTP REST API (Axios + JWT)
                                    |
                                    v
                  +-----------------+-----------------+
                  |      FastAPI Backend (Uvicorn)    |
                  +--------+----------------+---------+
                           |                |
           +---------------+                +---------------+
           |                                                |
           v                                                v
+----------+----------+                          +----------+----------+
|  SQLite Database    |                          |  PyTorch AI Engine  |
| (ovarian_analyzer)  |                          | (ResNet18 Model)    |
+----------+----------+                          +----------+----------+
           |                                                |
           | User, Patient,                                 | Preprocessing, Logits,
           | Analysis records                               | Softmax, Grad-CAM Heatmap
           |                                                |
           +-----------------------+------------------------+
                                   |
                                   v
                  +----------------+----------------+
                  |     ReportLab PDF Generator     |
                  |   (ReportLab Platypus Engine)   |
                  +----------------+----------------+
                                   |
                                   v
                  +----------------+----------------+
                  | Generated PDF Diagnostic Report |
                  +---------------------------------+
```

---

## SECTION 7 — FRONTEND ARCHITECTURE

- **`components/`**: Reusable visual components (Navbar, Sidebar, UploadBox, Cards, Charts).
- **`pages/`**: View components rendered at specific routes (Dashboard, NewAnalysis, AnalysisResult).
- **`services/`**: API abstraction layer handling HTTP requests via Axios (`api.js`).
- **`context/`**: Global state management (`AuthContext.jsx`) holding token state and user information.
- **`hooks/`**: Helper hooks (`useAuth.js`) to consume contexts conveniently.
- **`utils/`**: Formatting functions (`formatConditionName`, `getConditionBadgeColor`, `formatDate`).

### Frontend Data Flow Example:
`User clicks "Analyze Image"` $\rightarrow$ `NewAnalysis.jsx` $\rightarrow$ `analysisService.runAnalysis(patientId, file)` $\rightarrow$ `api.js (Axios multipart request with Bearer JWT header)` $\rightarrow$ `FastAPI POST /api/analysis/analyze` $\rightarrow$ `Response JSON` $\rightarrow$ `Navigate to /analysis/{analysis_id}` $\rightarrow$ `AnalysisResult.jsx renders result`.

---

## SECTION 8 — EVERY IMPORTANT FRONTEND PAGE

1. **Login (`Login.jsx`)**: Authenticates clinicians using email and password. Receives JWT token upon success and redirects to `/dashboard`.
2. **Register (`Register.jsx`)**: Creates a new user account with name, email, and password.
3. **Dashboard (`Dashboard.jsx`)**: Displays summary stats (total patients, total analyses), quick shortcuts, recent diagnostic runs, and recent patient additions.
4. **Patients (`Patients.jsx`)**: Shows directory of registered patients, search bar filtering by name or code, and a modal form to add a new patient.
5. **PatientDetails (`PatientDetails.jsx`)**: Displays single patient file information, total analyses, and list of all past scans with direct links to view results or download PDFs.
6. **NewAnalysis (`NewAnalysis.jsx`)**: Allows selecting a patient, dragging/dropping or picking an ultrasound image file, previewing the image, and launching AI analysis.
7. **AnalysisResult (`AnalysisResult.jsx`)**: Displays top prediction, confidence %, 5-class probability bar chart, side-by-side original ultrasound vs Grad-CAM heatmap overlay, factual summary, and PDF download button.
8. **History (`History.jsx`)**: Table listing all previous analyses across patients with real-time search filtering, view links, and PDF download buttons.
9. **Profile (`Profile.jsx`)**: Displays active clinician profile information and system AI model specifications (ResNet18, 224x224, Grad-CAM).

---

## SECTION 9 — BACKEND ARCHITECTURE

FastAPI is structured using clean separation of concerns:
- **`routes/`**: Handles HTTP requests, parameter parsing, dependency injection, and HTTP status responses.
- **`services/`**: Contains core business logic (auth authentication, patient code generation, inference orchestration, PDF building).
- **`ai/`**: Decoupled PyTorch AI logic (model loader, preprocessing pipeline, predictor inference, Grad-CAM generator).
- **`database/`**: SQLAlchemy ORM models and database session management (`get_db`).
- **`schemas/`**: Pydantic models for request body validation and response serialization.

### Request Lifecycle:
`Frontend Axios HTTP Request` $\rightarrow$ `FastAPI Route` $\rightarrow$ `Security/Auth Dependency Check` $\rightarrow$ `Service Layer` $\rightarrow$ `AI Predictor & Grad-CAM` $\rightarrow$ `SQLAlchemy DB Commit` $\rightarrow$ `JSON Response`.

---

## SECTION 10 — API ENDPOINTS

| Method | Endpoint | Purpose | Auth Required? | Request Payload | Response Payload |
|---|---|---|---|---|---|
| `GET` | `/api/health` | Backend health check | No | None | `{"status": "ok"}` |
| `POST` | `/api/auth/register` | Register clinician | No | `UserRegister` (name, email, password) | `UserResponse` (id, name, email, created_at) |
| `POST` | `/api/auth/login` | Sign in & receive JWT | No | `UserLogin` (email, password) | `Token` (access_token, token_type, user) |
| `GET` | `/api/auth/me` | Fetch active profile | Yes (Bearer) | None | `UserResponse` |
| `POST` | `/api/patients` | Create patient record | Yes (Bearer) | `PatientCreate` (name, age, gender) | `PatientResponse` (id, patient_code, name, age, ...) |
| `GET` | `/api/patients` | List/search patients | Yes (Bearer) | Query param `search` (optional) | `List[PatientResponse]` |
| `GET` | `/api/patients/{id}` | Get patient details | Yes (Bearer) | Path param `id` | `PatientResponse` |
| `GET` | `/api/patients/{id}/analyses`| Get patient scans | Yes (Bearer) | Path param `id` | `List[AnalysisResponse]` |
| `POST` | `/api/analysis/analyze` | Execute AI analysis | Yes (Bearer) | Form data (`patient_id`, `file`) | `AnalysisResponse` (analysis_id, prediction, probabilities, URLs) |
| `GET` | `/api/analysis/history`| List analysis history | Yes (Bearer) | None | `List[AnalysisResponse]` |
| `GET` | `/api/analysis/{id}` | Get analysis result | Yes (Bearer) | Path param `id` | `AnalysisResponse` |
| `GET` | `/api/reports/{id}/pdf`| Download report PDF | Yes (Bearer) | Path param `id` | File Response (`application/pdf`) |

---

## SECTION 11 — AUTHENTICATION

1. **Registration**: Password is hashed using native `bcrypt` (`bcrypt.hashpw`) before being stored in the SQLite database. Plaintext passwords are never saved.
2. **Login**: Password is verified against the database hash (`bcrypt.checkpw`). If valid, FastAPI creates a signed **JWT Access Token** containing the user ID in its payload (`sub`).
3. **Token Usage**: Frontend stores JWT in `localStorage` and attaches it to every outgoing Axios request using the `Authorization: Bearer <token>` header.
4. **Analogy**:
   > **JWT Analogy**: A JWT is like a **stamped event wristband**. Once verified at the entrance (login), you don't need to present your ID (password) at every booth (API endpoint); you simply show your wristband (JWT token).

---

## SECTION 12 — DATABASE

Database Engine: **SQLite 3** (`ovarian_analyzer.db`) | ORM: **SQLAlchemy 2.0**

```
+--------------------+           +--------------------+
|       USERS        |           |      PATIENTS      |
+--------------------+           +--------------------+
| id (PK)            |<----------| id (PK)            |
| name               | 1       * | patient_code (UNI) |
| email (UNI, IDX)   |           | name               |
| password_hash      |           | age                |
| created_at         |           | gender             |
+--------------------+           | created_by (FK)    |
          |                      | created_at         |
          | 1                    +--------------------+
          |                                | 1
          v *                              v *
+-----------------------------------------------------+
|                      ANALYSES                       |
+-----------------------------------------------------+
| id (PK)                                             |
| patient_id (FK -> patients.id)                      |
| user_id (FK -> users.id)                            |
| image_path                                          |
| predicted_class                                     |
| confidence                                          |
| probabilities (JSON text)                           |
| gradcam_path                                        |
| report_path                                         |
| created_at                                          |
+-----------------------------------------------------+
```

### Data Isolation Enforcement
Every patient query and analysis query filters by `created_by == current_user.id` or `user_id == current_user.id` at the database query level, preventing unauthorized access across users.

---

## SECTION 13 — AI MODEL

### Architecture: ResNet18 (Residual Neural Network - 18 Layers)
- **CNN (Convolutional Neural Network)**: A deep learning model specialized for processing spatial grid structured data (images).
- **Residual Connections / Skip Connections**: ResNet introduces shortcut connections that bypass one or more layers, adding the input $x$ directly to the output of a block $F(x) + x$. This solves the **vanishing gradient problem**, allowing deep networks to train effectively.
- **Why ResNet18?**: Provides an optimal trade-off between computational efficiency, speed, and high feature extraction accuracy for medical ultrasound image classification.

---

## SECTION 14 — MODEL CHECKPOINT

The pre-trained model file is `backend/models/resnet18.pkl`.
- **Contents**: Pickled Python dictionary containing:
  - `model_name`: `"resnet18"`
  - `num_classes`: `5`
  - `class_names`: `['complex_cyst', 'dominant_follicle', 'healthy', 'poly_cyst', 'simple_cyst']`
  - `image_size`: `224`
  - `state_dict`: Dictionary of tensor weights for all layers (including final classifier `fc.weight` shape `[5, 512]`).

### State Dict vs Serialized Model Object
> **Technical Note**: The `.pkl` file contains a **weights checkpoint dictionary (`state_dict`)**, NOT a fully serialized model object. Therefore, the code recreates `models.resnet18(weights=None)`, updates `model.fc = nn.Linear(512, 5)`, and then loads `state_dict` via `model.load_state_dict(ckpt["state_dict"])`.

---

## SECTION 15 — MODEL CLASSES

| Class Index | Class Name | Human-Readable Label |
|---|---|---|
| `0` | `complex_cyst` | Complex Cyst |
| `1` | `dominant_follicle` | Dominant Follicle |
| `2` | `healthy` | Healthy Ovarian Tissue |
| `3` | `poly_cyst` | Polycystic Ovary (PCOS Pattern) |
| `4` | `simple_cyst` | Simple Cyst |

*Note: Class mapping indices (0..4) are hardcoded into the trained weights of `resnet18.pkl` and must never be altered.*

---

## SECTION 16 — IMAGE PREPROCESSING

```python
eval_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
```

1. **RGB Conversion**: Ensures 3-channel input format.
2. **Resize (224x224)**: Resizes input images to match ResNet18's expected input spatial dimensions.
3. **ToTensor**: Scales pixel values from `[0, 255]` to `[0.0, 1.0]` tensor format.
4. **ImageNet Normalization**: Subtracts standard ImageNet mean and divides by standard deviation so input feature distributions match pre-trained feature statistics.
5. **Deterministic Inference**: No random cropping, flips, or rotations are applied during evaluation.

---

## SECTION 17 — PREDICTION PIPELINE

`Raw Image Bytes` $\rightarrow$ `PIL Image RGB` $\rightarrow$ `Resize (224x224)` $\rightarrow$ `Tensor [1, 3, 224, 224]` $\rightarrow$ `ResNet18 Forward Pass` $\rightarrow$ `Logits Tensor [1, 5]` $\rightarrow$ `Softmax Operation` $\rightarrow$ `Probabilities [0.0 - 1.0]` $\rightarrow$ `Argmax (Top Class Index)` $\rightarrow$ `Result Dictionary`.

---

## SECTION 18 — PROBABILITY CALCULATION

- **Logits**: Raw unnormalized output scores from the final linear layer ($z_i$).
- **Softmax Formula**: Converts raw logits into normalized probabilities that sum to 1.0 (100%):
  $$\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$$
- **Confidence**: The probability score associated with the top predicted class ($max(\sigma(z))$).

---

## SECTION 19 — GRAD-CAM (EXPLAINABLE AI)

**Grad-CAM (Gradient-weighted Class Activation Mapping)** produces a coarse localization map highlighting important regions in an image that influenced the neural network's prediction.

### Implementation Details:
1. **Target Layer**: `model.layer4[-1]` (the last convolutional block of ResNet18).
2. **Forward Hook**: Captures feature map activations $A^k$ of shape `[C, H, W]`.
3. **Backward Hook**: Captures gradients $G^k = \frac{\partial y^c}{\partial A^k}$ of target class score $y^c$ with respect to feature maps.
4. **Global Average Pooling (GAP)**: Computes channel importance weights:
   $$\alpha_k^c = \frac{1}{Z} \sum_{i} \sum_{j} \frac{\partial y^c}{\partial A_{i,j}^k}$$
5. **Weighted Combination & ReLU**:
   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$
6. **Overlay Generation**: Resizes heatmap to image dimensions, applies OpenCV `COLORMAP_JET`, and blends with original ultrasound ($0.6 \cdot \text{Original} + 0.4 \cdot \text{Heatmap}$).

---

## SECTION 20 — GRAD-CAM VS SEGMENTATION

| Feature | Grad-CAM (Implemented) | Image Segmentation (Not Implemented) |
|---|---|---|
| **Output Type** | Coarse intensity heatmap overlay | Precise pixel-level region boundary mask |
| **Purpose** | Explainability / Visual Attention Map | Anatomical contouring / Area measurement |
| **Model Type** | Feature map activation from Classifier | Trained Segmentation Network (e.g. U-Net) |

> **IMPORTANT**: The system implements **Grad-CAM explainability**, NOT image segmentation. It must never be referred to as automated medical segmentation.

---

## SECTION 21 — ANALYSIS WORKFLOW

`User Selects Patient & Image` $\rightarrow$ `React sends FormData via POST /api/analysis/analyze` $\rightarrow$ `FastAPI validates file type & size` $\rightarrow$ `Predictor runs ResNet18 inference` $\rightarrow$ `Grad-CAM generates heatmap overlay` $\rightarrow$ `Analysis saved to SQLite` $\rightarrow$ `ReportLab generates PDF report` $\rightarrow$ `Frontend receives JSON response & updates UI`.

---

## SECTION 22 — DATABASE STORAGE AFTER ANALYSIS

Each completed analysis persists the following record in `analyses`:
- `id`: Auto-increment primary key
- `patient_id`: Foreign key to `patients.id`
- `user_id`: Foreign key to `users.id`
- `image_path`: `"uploads/ultrasound/ultrasound_xxxx.png"`
- `predicted_class`: `"poly_cyst"` (or corresponding predicted class)
- `confidence`: `99.19`
- `probabilities`: JSON string `{"complex_cyst": 0.58, "dominant_follicle": 0.13, ...}`
- `gradcam_path`: `"uploads/gradcam/gradcam_xxxx.png"`
- `report_path`: `"reports/report_xxxx.pdf"`
- `created_at`: UTC Timestamp

---

## SECTION 23 — PDF REPORT SYSTEM

`report_service.py` uses **ReportLab Platypus** to build professional PDF documents:
1. `SimpleDocTemplate` initializes document geometry.
2. `Paragraph` objects format headers, patient details, and metadata tables using clean inline HTML-like markup.
3. `Table` and `TableStyle` structure patient info and 5-class probability scores.
4. `RLImage` places original ultrasound and Grad-CAM heatmap side-by-side.
5. Factual summary paragraph and red disclaimer box are appended.
6. `doc.build(story)` writes PDF file to `backend/reports/`.
7. `GET /api/reports/{id}/pdf` serves file download via FastAPI `FileResponse`.

---

## SECTION 24 — PDF CONTENT

The PDF report strictly includes:
- **Title**: OVARIAN DISEASES ANALYZER - AI-Assisted Ultrasound Analysis Report
- **Metadata**: Report ID, Date, Clinician Name
- **Patient Info**: Name, Patient Code, Age, Gender
- **AI Classification**: Predicted Condition, Model Confidence %
- **Class Probabilities**: 5-class table with percentage breakdown and `PRIMARY PREDICTION` badge
- **Visual XAI**: Side-by-side Original Ultrasound and Grad-CAM Heatmap
- **AI-Assisted Analysis Summary**: Factual summary of classification output
- **Medical Disclaimer**: Standard safety disclaimer text

---

## SECTION 25 — ERROR HANDLING

- **Invalid File Format**: HTTP 400 Bad Request if file extension is not `.jpg`, `.jpeg`, or `.png`.
- **File Size Limit**: HTTP 400 Bad Request if uploaded image exceeds 15 MB.
- **Unauthorized Requests**: HTTP 401 Unauthorized if JWT token is missing, invalid, or expired.
- **Record Not Found**: HTTP 404 Not Found if requested patient or analysis does not exist or belong to user.
- **Global Error Handler**: FastAPI global exception handler catches unhandled Python exceptions and returns clean HTTP 500 JSON without leaking raw tracebacks.

---

## SECTION 26 — SECURITY

1. **Password Hashing**: Native `bcrypt` algorithm for secure password hashing.
2. **JWT Authentication**: Signed tokens with HTTP Bearer header validation.
3. **CORS Configuration**: Restricts cross-origin requests to configured frontend origin (`http://localhost:5173`).
4. **Data Isolation**: Database queries scoped strictly to authenticated user ID.
5. **Environment Variables**: Sensitive parameters (`SECRET_KEY`, `DATABASE_URL`) stored in `.env`.

---

## SECTION 27 — ENVIRONMENT VARIABLES

### Backend (`backend/.env`)
- `SECRET_KEY`: Cryptographic signing key for JWT tokens.
- `ALGORITHM`: Token signing algorithm (`HS256`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token validity duration (`1440` mins = 24 hours).
- `DATABASE_URL`: SQLAlchemy connection URI (`sqlite:///./database/ovarian_analyzer.db`).
- `MODEL_PATH`: Relative path to PyTorch checkpoint (`./models/resnet18.pkl`).
- `UPLOAD_DIR`: Target directory for saved images (`./uploads`).
- `REPORT_DIR`: Target directory for generated PDF reports (`./reports`).

### Frontend (`frontend/.env`)
- `VITE_API_URL`: Backend API base URL (`http://localhost:8000`).

---

## SECTION 28 — COMPLETE USER JOURNEY

`Register Account` $\rightarrow$ `Sign In` $\rightarrow$ `Dashboard Overview` $\rightarrow$ `Add Patient (Jessica Taylor, 29)` $\rightarrow$ `Navigate to New Analysis` $\rightarrow$ `Upload Ultrasound Scan` $\rightarrow$ `Click Run AI Analysis` $\rightarrow$ `View ResNet18 Prediction & Grad-CAM` $\rightarrow$ `Click Download PDF Report` $\rightarrow$ `View Diagnostic History` $\rightarrow$ `Re-download Old Report` $\rightarrow$ `Logout`.

---

## SECTION 29 — COMPLETE DATA FLOW

```
[ User Action: Upload Scan ]
           |
           v
   [ React Frontend ]  ---> Axios POST /api/analysis/analyze (Multipart + JWT)
           |
           v
   [ FastAPI Router ]  ---> Validate JWT Token & Input File
           |
           v
 [ Analysis Service ]  ---> Load Image Bytes
           |
           v
  [ AI Preprocessing ] ---> Resize (224x224), ToTensor, ImageNet Normalization
           |
           v
   [ PyTorch Engine ]  ---> Forward Pass on ResNet18 -> Logits -> Softmax
           |
           v
   [ Grad-CAM Module]  ---> Layer4 Hooks -> Compute Heatmap -> Blend OpenCV Image
           |
           v
[ SQLAlchemy / SQLite ]---> Insert Record into 'analyses' Table
           |
           v
 [ ReportLab Builder] ---> Generate & Save 'report_x.pdf'
           |
           v
   [ JSON Response ]   ---> Return Analysis Data, Image URLs, Report URL
           |
           v
   [ React Result UI ] ---> Render Prediction, Probability Chart, Grad-CAM Overlay
```

---

## SECTION 30 — WHY EACH TECHNOLOGY WAS USED

| Technology | Why We Used It |
|---|---|
| **React** | To build a fast, interactive single-page medical application interface. |
| **FastAPI** | To provide high-performance async REST API endpoints with automatic documentation. |
| **PyTorch** | To execute deep learning tensor computations and ResNet18 model inference. |
| **ResNet18** | Pre-trained convolutional network architecture optimized for medical image classification. |
| **Grad-CAM** | To provide visual explainability (XAI) and highlight feature attention regions. |
| **ReportLab** | To programmatically construct downloadable, clinical PDF reports. |
| **SQLite + SQLAlchemy** | To provide lightweight, reliable local relational data persistence and ORM queries. |
| **JWT + Bcrypt** | To secure API routes and protect user passwords with industry-standard cryptography. |

---

## SECTION 31 — IMPORTANT TECHNICAL CONCEPTS I MUST KNOW (VIVA GLOSSARY)

1. **React**: A JavaScript library for building user interfaces based on UI components. *(Analogy: Building a car out of modular LEGO bricks).*
2. **Vite**: A modern frontend build tool that provides instant server start and fast HMR (Hot Module Replacement).
3. **State vs Props**: State is internal mutable component memory; Props are read-only inputs passed from parent to child.
4. **Context API**: A React feature allowing global state (like user login token) to be shared across components without prop drilling.
5. **Axios**: A promise-based HTTP client for making API requests from the browser to the backend.
6. **REST API**: Representational State Transfer — a standard architectural style for HTTP communication using standard verbs (GET, POST, PUT, DELETE).
7. **FastAPI**: A modern, high-performance Python web framework built on standard Python type hints and Starlette/Pydantic.
8. **ORM (SQLAlchemy)**: Object-Relational Mapper that allows interacting with database tables using Python classes instead of writing raw SQL commands.
9. **JWT (JSON Web Token)**: A compact, URL-safe token format used for authenticating requests. *(Analogy: A stamped event wristband).*
10. **Bcrypt**: A one-way salted cryptographic hash function for storing passwords safely.
11. **CNN (Convolutional Neural Network)**: A class of deep neural networks specialized for analyzing visual imagery by applying spatial filter kernels.
12. **ResNet / Residual Connections**: A neural network architecture featuring skip connections that allow gradients to flow directly through layers, preventing vanishing gradients.
13. **Logits**: The raw, unnormalized scalar prediction scores output by the final linear layer of a neural network before softmax.
14. **Softmax**: A function that turns a vector of raw logits into a probability distribution summing to 1.0 (100%).
15. **Grad-CAM**: Gradient-weighted Class Activation Mapping — an explainable AI technique using gradients flowing into final conv layers to produce a coarse visual heatmap.
16. **ReportLab**: A Python library for programmatically generating PDF documents.

---

## SECTION 32 — TOP 50 PROJECT VIVA QUESTIONS & ANSWERS

### A. Project Basics
1. **Q: What is the main objective of your project?**  
   *A:* To build an AI-assisted decision-support system that classifies pelvic ultrasound images into 5 categories using ResNet18 and provides visual Grad-CAM explainability overlays alongside PDF reports.
2. **Q: Is this system intended to replace radiologists or gynecologists?**  
   *A:* No. It is an educational and decision-support tool. It provides AI-assisted predictions and visual heatmaps, NOT confirmed clinical diagnoses.
3. **Q: What are the 5 target classes classified by the model?**  
   *A:* Complex Cyst, Dominant Follicle, Healthy Ovarian Tissue, Polycystic Ovary (PCOS), and Simple Cyst.

### B. Frontend
4. **Q: Why did you choose React over traditional static HTML?**  
   *A:* React provides dynamic state management, fast component re-rendering, single-page application (SPA) user experience, and easy API integration.
5. **Q: How does `AuthContext` work in your frontend?**  
   *A:* It wraps the application to store user authentication status and JWT tokens in memory/localStorage, making auth state available globally.
6. **Q: What is `ProtectedRoute.jsx`?**  
   *A:* A component wrapper that checks if a valid user session exists. If not authenticated, it automatically redirects the user to `/login`.
7. **Q: How do you handle file uploads in React?**  
   *A:* `UploadBox.jsx` uses the HTML5 File API and `FormData` objects sent via Axios multipart HTTP POST requests to FastAPI.

### C. Backend
8. **Q: Why did you choose FastAPI for the backend?**  
   *A:* FastAPI is high-performance, async-capable, natively integrates with PyTorch and Python data libraries, and automatically generates Swagger API docs.
9. **Q: What is the purpose of `main.py`?**  
   *A:* It initializes the FastAPI application, configures CORS middleware, mounts static upload directories, registers API routers, and handles startup events.
10. **Q: How are static files (images) served by FastAPI?**  
    *A:* `app.mount("/uploads", StaticFiles(directory=upload_abs_path), name="uploads")` mounts the static uploads directory to serve images via HTTP endpoints.

### D. Database
11. **Q: What database engine are you using?**  
    *A:* SQLite 3 accessed via SQLAlchemy 2.0 ORM.
12. **Q: What tables exist in your database?**  
    *A:* `users`, `patients`, and `analyses`.
13. **Q: How do you establish relationships between tables?**  
    *A:* Using SQLAlchemy `ForeignKey` columns (`patients.created_by -> users.id` and `analyses.patient_id -> patients.id`).
14. **Q: How is multi-user privacy enforced?**  
    *A:* Queries explicitly filter records by the authenticated user's ID (`created_by == current_user.id`).

### E. AI / Deep Learning
15. **Q: What neural network architecture is used?**  
    *A:* ResNet18 (18-layer Residual Convolutional Neural Network).
16. **Q: What is the input image dimension required by the model?**  
    *A:* $224 \times 224$ pixels with 3 color channels (RGB).
17. **Q: Why do you normalize images using ImageNet mean and std?**  
    *A:* Because the model was pre-trained on ImageNet statistics; normalizing ensures input feature distributions match pre-trained weight expectations.
18. **Q: What is the difference between logits and probabilities?**  
    *A:* Logits are raw unnormalized outputs from the linear layer; probabilities are normalized values between 0 and 1 (summing to 1.0) calculated via Softmax.
19. **Q: What does the model confidence score represent?**  
    *A:* The highest Softmax probability score associated with the top predicted class output by the neural network.

### F. Grad-CAM (Explainable AI)
20. **Q: What does Grad-CAM stand for?**  
    *A:* Gradient-weighted Class Activation Mapping.
21. **Q: Why is Grad-CAM necessary in medical AI applications?**  
    *A:* Deep learning models are often viewed as "black boxes". Grad-CAM provides visual transparency by highlighting image regions that influenced the decision.
22. **Q: Which layer of ResNet18 is targeted for Grad-CAM?**  
    *A:* The final convolutional layer block (`model.layer4[-1]`), because higher conv layers capture high-level semantic spatial features.
23. **Q: How is the final Grad-CAM visual generated?**  
    *A:* Importance weights are calculated via Global Average Pooling of gradients, multiplied by feature maps, passed through ReLU, normalized, and blended with original image using OpenCV JET colormap.
24. **Q: Is Grad-CAM an image segmentation mask?**  
    *A:* No. Grad-CAM is a visual feature explainability heatmap, not a precise pixel-level anatomical segmentation mask.

### G. Security & Authentication
25. **Q: How are user passwords secured?**  
    *A:* Using one-way cryptographic `bcrypt` hashing. Passwords are never stored in plaintext.
26. **Q: What is a JWT token?**  
    *A:* A digitally signed JSON Web Token containing encoded payload claims (such as user ID and expiration timestamp).
27. **Q: Where is the JWT token stored on the frontend?**  
    *A:* In `localStorage` and attached via Axios request headers (`Authorization: Bearer <token>`).
28. **Q: How does FastAPI verify authorized requests?**  
    *A:* The `get_current_user` dependency intercepts the HTTP Bearer header, decodes the JWT using `SECRET_KEY`, and retrieves the user record from the database.

### H. PDF Reports & Output
29. **Q: What library is used for PDF report generation?**  
    *A:* ReportLab (Platypus engine).
30. **Q: What elements are included in the PDF report?**  
    *A:* Report ID, clinician info, patient metadata, top prediction, confidence, 5-class probability breakdown table, side-by-side ultrasound and Grad-CAM images, factual summary, and medical disclaimer.
31. **Q: How does the frontend download the generated PDF?**  
    *A:* `reportService.js` issues a request with `responseType: 'blob'`, creating a temporary object URL that triggers a browser file download.

---

## SECTION 33 — TOP "WHY" QUESTIONS (ENGINEERING RATIONALE)

- **Why React?** *(Engineering Rationale)*: Enables component reusability, quick UI updates, and simple state management for medical dashboards.
- **Why FastAPI?** *(Engineering Rationale)*: Provides high execution speed, async capabilities, type safety via Pydantic, and native Python AI library integration.
- **Why ResNet18?** *(Engineering Rationale)*: ResNet18 offers skip connections that prevent vanishing gradients while maintaining high classification speed and low computational overhead.
- **Why 224x224 input size?** *(Engineering Rationale)*: Standard spatial resolution for ResNet18 architectures pre-trained on ImageNet benchmarks.
- **Why Grad-CAM instead of segmentation?** *(Engineering Rationale)*: The trained model is a 5-class classification network; Grad-CAM provides visual explainability without requiring pixel-level annotation masks.

---

## SECTION 34 — CODE WALKTHROUGH

### 1. Model Loader (`backend/app/ai/model_loader.py`)
```python
# Recreates ResNet18 architecture & loads weights from state_dict checkpoint
model = models.resnet18(weights=None)
model.fc = torch.nn.Linear(512, self.num_classes)
model.load_state_dict(state_dict)
model.to(self.device)
model.eval()
```
*Explanation*: Initializes empty ResNet18 backbone, modifies final fully connected layer `fc` to output 5 class scores, loads state_dict tensors, transfers to device (CPU/CUDA), and sets to evaluation mode.

### 2. Inference & Softmax (`backend/app/ai/predictor.py`)
```python
with torch.no_grad():
    logits = model(tensor_input)
    probabilities_tensor = torch.softmax(logits, dim=1)[0]
```
*Explanation*: Disables gradient computation for fast evaluation, performs forward pass to compute raw logits, and applies Softmax along dimension 1 to compute percentage probabilities.

### 3. Grad-CAM Activation Hooks (`backend/app/ai/gradcam.py`)
```python
def _save_activations(self, module, input, output):
    self.activations = output

def _save_gradients(self, module, grad_input, grad_output):
    self.gradients = grad_output[0]
```
*Explanation*: Registers PyTorch forward and backward hooks on `model.layer4[-1]` to extract feature map activations $A$ and backpropagated gradients $G$.

---

## SECTION 35 — ACTUAL REQUEST & RESPONSE EXAMPLES

### POST `/api/analysis/analyze`
**Request**: `FormData` (`patient_id=1`, `file=<binary_ultrasound.png>`)  
**Header**: `Authorization: Bearer <token>`

**Response JSON**:
```json
{
  "analysis_id": 1,
  "patient_id": 1,
  "patient_name": "Jessica Taylor",
  "patient_code": "PAT-0001",
  "prediction": "poly_cyst",
  "confidence": 99.19,
  "probabilities": {
    "complex_cyst": 0.58,
    "dominant_follicle": 0.13,
    "healthy": 0.10,
    "poly_cyst": 99.19,
    "simple_cyst": 0.01
  },
  "original_image_url": "/uploads/ultrasound/ultrasound_xxxx.png",
  "gradcam_image_url": "/uploads/gradcam/gradcam_xxxx.png",
  "report_path": "/reports/report_1.pdf",
  "created_at": "2026-09-25T14:30:00"
}
```

---

## SECTION 36 — PROJECT LIMITATIONS

1. **Classification vs. Segmentation**: System classifies overall image morphology; it does not output pixel-level region segmentation boundaries.
2. **Decision Support Nature**: Model output represents statistical pattern recognition, NOT an autonomous medical diagnosis.
3. **Local Storage Scope**: Built for single-institution local SQLite deployment; multi-node database replication is not implemented.

---

## SECTION 37 — FUTURE ENHANCEMENTS

- **Segmentation Module Integration**: Adding a trained U-Net segmentation network for anatomical lesion boundary tracing.
- **Cloud Object Storage**: Migrating local upload storage to AWS S3 or Google Cloud Storage.
- **DICOM Image Support**: Adding native parsing for medical DICOM format (.dcm) files.

---

## SECTION 38 — QUICK REVISION SHEET ("PROJECT IN 5 MINUTES")

- **Goal**: AI-Assisted Ovarian Ultrasound Classifier & Decision Support Tool.
- **Frontend**: React 19 + Vite + Axios + React Router + Glassmorphism UI.
- **Backend**: FastAPI + Python 3.12 + Uvicorn + Pydantic.
- **Database**: SQLite 3 + SQLAlchemy 2.0 ORM (`users`, `patients`, `analyses`).
- **AI Core**: PyTorch ResNet18 model loaded from `resnet18.pkl` (`state_dict`).
- **Input / Classes**: 224x224 RGB image $\rightarrow$ 5 classes (`complex_cyst`, `dominant_follicle`, `healthy`, `poly_cyst`, `simple_cyst`).
- **XAI**: Grad-CAM heatmaps generated from ResNet18 `layer4[-1]` conv layer using forward/backward activation hooks.
- **Reports**: Programmatic ReportLab PDF generation with side-by-side images, probability breakdown, and disclaimers.
- **Security**: JWT authentication + Bcrypt password hashing + User-level data isolation.

---

## SECTION 39 — 2-MINUTE PROJECT EXPLANATION (INTERVIEW / VIVA SCRIPT)

> "Good morning. My project is the **Ovarian Diseases Analyzer**, an AI-assisted decision-support system designed to assist clinicians in evaluating pelvic ultrasound scans. The system features a modern **React 19** single-page frontend and a high-performance **FastAPI** Python backend. 
> 
> When a clinician uploads an ovarian ultrasound image, the system preprocesses it into a 224x224 RGB tensor with ImageNet normalization and passes it through a pre-trained **ResNet18** deep learning model. The model computes a Softmax probability distribution across five diagnostic categories: Complex Cyst, Dominant Follicle, Healthy Tissue, Polycystic Ovary (PCOS), and Simple Cyst.
> 
> To solve the neural network 'black box' issue, we implemented **Grad-CAM explainable AI**. By hooking into the final convolutional layer of ResNet18, the backend calculates importance gradients and generates a color heatmap overlay that highlights which image regions contributed to the model's prediction.
> 
> All patient records and scan histories are securely persisted in an **SQLite** database via **SQLAlchemy**, protected by **JWT authentication** and **Bcrypt** password hashing. Finally, the system automatically builds downloadable PDF diagnostic reports using **ReportLab**, featuring complete patient metadata, probability charts, visual heatmaps, and medical disclaimers."

---

## SECTION 40 — 30-SECOND PROJECT EXPLANATION (ELEVATOR PITCH)

> "The **Ovarian Diseases Analyzer** is an AI-assisted decision-support web application that classifies pelvic ultrasound scans into five diagnostic categories using a **ResNet18** deep learning model. Built with **React** and **FastAPI**, it features **Grad-CAM visual heatmaps** for AI explainability, user authentication, patient history tracking in **SQLite**, and automated **ReportLab PDF report generation**."

---

## SECTION 41 — PROJECT ARCHITECTURE DIAGRAM

```
                  USER (Browser)
                        |
                        v
              +-------------------+
              |  React 19 Frontend|
              +---------+---------+
                        |
                  Axios / JWT
                        |
                        v
              +-------------------+
              |  FastAPI Backend  |
              +----+----+----+----+
                   |    |    |
         +---------+    |    +---------+
         |              |              |
         v              v              v
  +--------------+ +----------+ +--------------+
  | SQLite DB    | | PyTorch  | | ReportLab    |
  | (SQLAlchemy) | | ResNet18 | | PDF Engine   |
  +--------------+ +----+-----+ +--------------+
                        |
                   Grad-CAM
                        |
                        v
                   Heatmap PNG
```

---

## SECTION 42 — FINAL ACCURACY CONFIRMATION

- **Frontend Framework**: React 19, Vite, React Router DOM 7, Axios (`package.json`).
- **Backend Framework**: FastAPI 0.100+, Uvicorn (`requirements.txt`).
- **AI Backbone**: PyTorch ResNet18 loaded via `pickle.load` and state_dict injection (`model_loader.py`).
- **Explainability**: Grad-CAM layer4 hook generator (`gradcam.py`).
- **PDF Engine**: ReportLab Platypus (`report_service.py`).
- **Database**: SQLite + SQLAlchemy ORM (`models.py`).
- **Authentication**: JWT + Bcrypt (`security.py`).

---

## SECTION 43 — DOCUMENTATION QUALITY CHECK

This document provides a complete, beginner-friendly, and technically rigorous reference designed for final-year project reviews, architecture explanations, viva defense, and technical interviews.
