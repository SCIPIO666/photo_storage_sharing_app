# 📂 CloudVault: Enterprise File Management System

CloudVault is a high-performance, layered backend API built with **Node.js**, **Express**, and **Prisma**. It provides a robust architecture for managing hierarchical file systems, recursive folder operations, and automated cloud synchronization.

---

## 🏗 System Architecture

The project follows a **Layered Architecture** (Controller-Service-Model) to ensure separation of concerns, maintainability, and ease of testing.



### 1. Route Layer
*   Defines API endpoints.
*   Applies **JWT** authentication and **Multer** file-processing middleware.
*   Integrates **Zod** schemas for strict request validation.

### 2. Controller Layer
*   Orchestrates the request/response lifecycle.
*   Extracts validated data and passes it to the Service layer.
*   Uses `next(error)` to delegate exceptions to the global error handler.

### 3. Service Layer
*   Contains core business logic.
*   Handles complex operations like permission checks and business-level data transformations.
*   Coordinates multiple model calls for complex workflows.

### 4. Model Layer
*   Direct interaction with **PostgreSQL** via **Prisma ORM**.
*   Interaction with **Cloudinary API** for media persistence.
*   Handles low-level data errors and rethrows them with contextual logging.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js (Express.js) |
| **Database** | PostgreSQL + Prisma ORM |
| **Cloud Storage** | Cloudinary (Media hosting) |
| **Security** | JWT (Auth), Bcrypt (Hashing) |
| **Validation** | Zod |
| **File Handling** | Multer |

---

## 🔐 Key Logic & Error Handling

### Recursive Operations
The system handles complex folder trees. When deleting a folder, the logic identifies all nested sub-folders and files, purges the media from Cloudinary using `publicId`, and cleans up the database metadata in a cascaded flow.

### Global Error Pipeline
Errors follow a "bubble-up" pattern:
1.  **Model/Service:** Throws an error.
2.  **Controller:** Catches the error and calls `next(error)`.
3.  **Middleware:** A centralized handler formats the error and sends a clean JSON response (e.g., `404 Not Found` or `400 Validation Error`).

---

## 🔌 API Endpoints

### 📁 Folders
*   `POST /api/folders` - Create a new folder (supports nesting).
*   `GET /api/folders` - Fetch user folders (supports root-only filtering).
*   `DELETE /api/folders/:id` - Delete folder (checks for empty or supports recursive purge).

### 📄 Files
*   `POST /api/files/upload` - Secure file upload via Multer to Cloudinary.
*   `POST /api/files/avatar` - Upsert logic for user profile pictures.
*   `GET /api/files/:id` - Retrieve metadata and secure cloud URL.
*   `GET /api/files/stats` - Aggregated storage usage and file-type breakdown.

---

## 🚀 Getting Started

1.  **Clone the repository** and run `npm install`.
2.  **Environment Setup:** Create a `.env` file with `DATABASE_URL`, `JWT_SECRET`, and `CLOUDINARY_URL`.
3.  **Prisma Setup:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  **Run Development:**
    ```bash
    npm run dev
    ```

---

## 🧪 Testing & Documentation
*   **Integration Tests:** Handled via **Jest** and **Supertest**.
*   **Validation:** All incoming request bodies are strictly typed with **Zod** to prevent SQL injection and malformed data.
```