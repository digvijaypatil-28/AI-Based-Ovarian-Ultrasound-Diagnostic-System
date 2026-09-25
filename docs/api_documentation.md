# API Documentation - Ovarian Diseases Analyzer

Base URL: `http://localhost:8000/api`

---

## Authentication Endpoints

### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
```json
{
  "name": "Dr. Elena Rostova",
  "email": "elena@hospital.org",
  "password": "Password123!"
}
```
- **Response**: `201 Created`

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "elena@hospital.org",
  "password": "Password123!"
}
```
- **Response**: `200 OK`
```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Dr. Elena Rostova",
    "email": "elena@hospital.org",
    "created_at": "2026-09-25T14:00:00"
  }
}
```

### 3. Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## Patient Management Endpoints

### 4. Create Patient
- **Endpoint**: `POST /api/patients`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Sarah Jenkins",
  "age": 32,
  "gender": "Female"
}
```
- **Response**: `201 Created`

### 5. List Patients
- **Endpoint**: `GET /api/patients?search=Sarah`
- **Header**: `Authorization: Bearer <token>`

### 6. Get Patient Details
- **Endpoint**: `GET /api/patients/{id}`

### 7. Get Patient Analysis History
- **Endpoint**: `GET /api/patients/{id}/analyses`

---

## AI Analysis Endpoints

### 8. Run AI Ultrasound Analysis
- **Endpoint**: `POST /api/analysis/analyze`
- **Header**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `patient_id`: `1`
  - `file`: `<ultrasound_image_file>`
- **Response**: `201 Created`
```json
{
  "analysis_id": 1,
  "patient_id": 1,
  "patient_name": "Sarah Jenkins",
  "patient_code": "PAT-0001",
  "prediction": "dominant_follicle",
  "confidence": 99.95,
  "probabilities": {
    "complex_cyst": 0.01,
    "dominant_follicle": 99.95,
    "healthy": 0.02,
    "poly_cyst": 0.01,
    "simple_cyst": 0.01
  },
  "original_image_url": "/uploads/ultrasound/ultrasound_xxxx.png",
  "gradcam_image_url": "/uploads/gradcam/gradcam_xxxx.png",
  "report_path": "/reports/report_1.pdf",
  "created_at": "2026-09-25T14:30:00"
}
```

### 9. Get User Analysis History
- **Endpoint**: `GET /api/analysis/history`

### 10. Get Analysis by ID
- **Endpoint**: `GET /api/analysis/{analysis_id}`

---

## Report Endpoints

### 11. Download PDF Report
- **Endpoint**: `GET /api/reports/{analysis_id}/pdf`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (Content-Type: `application/pdf`)
