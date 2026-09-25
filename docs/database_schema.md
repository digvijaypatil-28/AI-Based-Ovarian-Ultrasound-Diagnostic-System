# Database Schema - Ovarian Diseases Analyzer

Database Engine: **SQLite 3**  
ORM: **SQLAlchemy 2.0**

---

## Entity Relationship Diagram (ERD)

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

---

## Table Specifications

### 1. `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto Increment | Unique user identifier |
| `name` | VARCHAR | NOT NULL | Full name of clinician |
| `email` | VARCHAR | UNIQUE, INDEX, NOT NULL | Account email address |
| `password_hash` | VARCHAR | NOT NULL | Bcrypt password hash |
| `created_at` | DATETIME | DEFAULT UTC | Registration timestamp |

### 2. `patients`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto Increment | Unique patient record identifier |
| `patient_code` | VARCHAR | UNIQUE, INDEX, NOT NULL | Medical record code (e.g. `PAT-0001`) |
| `name` | VARCHAR | NOT NULL | Patient full name |
| `age` | INTEGER | NOT NULL | Patient age in years |
| `gender` | VARCHAR | DEFAULT 'Female' | Patient gender |
| `created_by` | INTEGER | FOREIGN KEY (`users.id`) | Clinician who created record |
| `created_at` | DATETIME | DEFAULT UTC | Patient creation timestamp |

### 3. `analyses`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto Increment | Analysis ID |
| `patient_id` | INTEGER | FOREIGN KEY (`patients.id`) | Associated patient ID |
| `user_id` | INTEGER | FOREIGN KEY (`users.id`) | User who executed analysis |
| `image_path` | VARCHAR | NOT NULL | Relative path to original ultrasound image |
| `predicted_class` | VARCHAR | NOT NULL | Top predicted class name |
| `confidence` | FLOAT | NOT NULL | Prediction confidence percentage (0-100) |
| `probabilities` | TEXT | NOT NULL | JSON string of class probability map |
| `gradcam_path` | VARCHAR | NOT NULL | Relative path to Grad-CAM overlay image |
| `report_path` | VARCHAR | NULLABLE | Relative path to generated PDF report |
| `created_at` | DATETIME | DEFAULT UTC | Analysis timestamp |
