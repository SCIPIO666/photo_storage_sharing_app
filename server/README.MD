# 📂 CloudVault Backend

An industrial-grade File and Folder Management API built with **Node.js**, **Express**, and **Prisma**. This system handles complex recursive file operations, automated cloud storage syncing via Cloudinary, and rigorous data validation.

---

## 🏗 System Architecture

The backend follows a **Layered Pattern** to ensure strict separation of concerns, making the codebase scalable and easy to test.



### 1. Route Layer
*   Defines API endpoints.
*   Applies **JWT** authentication and **Multer** file-processing middleware.
*   Integrates **Zod** schemas for request validation.

### 2. Controller Layer
*   Orchestrates the request/response lifecycle.
*   Extracts validated data and passes it to services.
*   **Error Handling:** Captures exceptions and passes them to the global error middleware via `next(error)`.

### 3. Service Layer
*   The "Brain" of the application.
*   Contains business rules (e.g., checking folder ownership before deletion).
*   Coordinates between different models.

### 4. Model Layer
*   Direct interaction with **PostgreSQL** via **Prisma**.
*   Direct interaction with the **Cloudinary SDK** for media persistence.
*   **Error Handling:** Logs low-level database errors and rethrows them to the service layer.

---

## 🛠 Tech Stack

*   **Runtime:** Node.js (Express.js)
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Cloud Storage:** Cloudinary
*   **Auth & Security:** JWT, Bcrypt
*   **Validation:** Zod
*   **Middleware:** Multer (File buffering), Morgan (Logging), CORS

---

## 🔐 Core Features & Logic

### Recursive Deletion
When a folder is deleted "recursively," the system performs a depth-first search to:
1.  Identify all sub-folders.
2.  Locate all files within those folders.
3.  Batch-delete assets from Cloudinary using `publicId`.
4.  Perform a cascaded deletion in the database.

### Avatar Upsertion
The avatar logic uses an `upsert` strategy. It identifies the user's existing avatar, replaces the file in Cloudinary, and updates the database record in a single transaction-like flow.

---

## 🔌 API Endpoints

### Files
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/files/upload` | Upload file to specific folder |
| `POST` | `/api/files/avatar` | Update user profile image |
| `GET` | `/api/files/:id` | Fetch metadata and Cloudinary URL |
| `DELETE` | `/api/files/:id` | Purge file from cloud and DB |
| `GET` | `/api/files/stats` | Get usage stats (size, type count) |

### Folders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/folders` | Create folder (supports nesting) |
| `GET` | `/api/folders` | List folders (supports `rootOnly` filter) |
| `DELETE` | `/api/folders/:id` | Delete (empty check or recursive) |
| `PUT` | `/api/folders/:id` | Rename or update folder parent |

---

## 🚦 Error Handling & Validation

### Request Validation (Zod)
Every request is validated against a schema before reaching the controller.
```javascript
const CreateFolderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.string().uuid().nullable()
});
```

### Global Error Handler
All errors are centralized. If a Model throws a `Folder not found` error, the controller catches it, and the middleware returns:
```json
{
  "status": "error",
  "message": "Folder not found",
  "stack": "..." // Only in development
}
```

---

## 🚀 Getting Started

1.  **Clone & Install:**
    ```bash
    npm install
    
```
2.  **Environment Variables:**
    Create a `.env` file with `DATABASE_URL`, `CLOUDINARY_URL`, and `JWT_SECRET`.
3.  **Database Migration:**
    ```bash
    npx prisma migrate dev
    ```
4.  **Launch:**
    ```bash
    npm run dev
    ```
```