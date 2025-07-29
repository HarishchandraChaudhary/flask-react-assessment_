# Task Comment Manager - Associate Software Engineer Assessment

## 🚀 Project Overview

This project is a solution to the Associate Software Engineer assessment provided by Better Software. It demonstrates the ability to build robust, maintainable, and scalable web applications using Python (Flask) for the backend and React for the frontend.

As an AI-powered software development agency, Better Software prioritizes creating applications with solid engineering foundations. This assessment focuses on building CRUD (Create, Read, Update, Delete) APIs for comments associated with tasks, along with automated tests and a functional frontend interface.

## ✨ Features

This application implements the following core functionalities:

### Task #1: Backend APIs (Flask)
* **CRUD for Comments:**
    * `POST /tasks/<task_id>/comments`: Add a new comment to a specific task.
    * `GET /tasks/<task_id>/comments`: Retrieve all comments for a given task.
    * `PUT /tasks/<task_id>/comments/<comment_id>`: Edit an existing comment.
    * `DELETE /tasks/<task_id>/comments/<comment_id>`: Delete a comment.
* **Automated Tests:** Comprehensive unit tests for all comment CRUD APIs ensuring reliability and correctness.
* `GET /tasks`: An auxiliary endpoint to fetch a list of pre-defined tasks for the frontend.

### Task #2 (Bonus): Frontend Interface (React)
* **Task Selection:** Ability to select a task from a list, which then displays its associated comments.
* **Add Comment:** A form to add new comments with author and text fields.
* **Edit Comment:** Functionality to modify existing comments directly within the UI.
* **Delete Comment:** Option to remove comments from a task with a confirmation prompt.
* **User Feedback:** Provides visual messages for successful operations and errors.

## 🛠️ Tech Stack

* **Backend:**
    * Python 3.x
    * Flask (Web Framework)
    * Flask-CORS (for handling cross-origin requests)
    * Pytest (for automated testing)
* **Frontend:**
    * React 18 (JavaScript Library)
    * HTML5, CSS3 (with Tailwind CSS for utility-first styling)
    * JavaScript (ES6+)

## 🚀 Setup & Installation

Follow these steps to get the project running on your local machine. You will need **two separate terminal windows**.

### Prerequisites

* Python 3.8+
* Node.js and npm (or Yarn)

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a Python virtual environment** (recommended):
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Flask application:**
    ```bash
    python app.py
    ```
    The backend server will start on `http://127.0.0.1:5000`. Keep this terminal open.

### 2. Frontend Setup

1.  **Open a NEW terminal window.**
2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
3.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
4.  **Run the React development server:**
    ```bash
    npm start
    # or yarn start
    ```
    The frontend application will typically open in your browser at `http://localhost:3000`. Keep this terminal open.

### Important Note:
For the application to function, **both the Flask backend (`python app.py`) and the React frontend (`npm start`) must be running simultaneously in separate terminal windows.**

## 🌐 API Endpoints

The Flask backend provides the following RESTful API endpoints:

| Method | Endpoint                          | Description                                | Request Body Example (for POST/PUT)                          | Response Example (Success)                                   | Error Response Example           |
| :----- | :-------------------------------- | :----------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------- |
| `GET`  | `/tasks`                          | Retrieve all available tasks.              | N/A                                                          | `[{"id": "task1", "title": "..."}, ...]`                     | N/A                              |
| `GET`  | `/tasks/<task_id>/comments`       | Retrieve all comments for a specific task. | N/A                                                          | `[{"id": "uuid1", "author": "...", "text": "..."}, ...]`    | `{"error": "Task not found"}`    |
| `POST` | `/tasks/<task_id>/comments`       | Add a new comment to a task.               | `{"author": "John Doe", "text": "This is a new comment."}`   | `{"id": "new-uuid", "author": "John Doe", "text": "..."}`   | `{"error": "Author and text are required"}` |
| `PUT`  | `/tasks/<task_id>/comments/<comment_id>` | Edit an existing comment.                  | `{"text": "Updated comment text."}` or `{"author": "Jane"}` | `{"id": "uuid", "author": "...", "text": "Updated..."}` | `{"error": "Comment not found"}` |
| `DELETE`| `/tasks/<task_id>/comments/<comment_id>` | Delete a comment.                          | N/A                                                          | `{"message": "Comment deleted successfully"}`                | `{"error": "Comment not found"}` |

## 🧪 Automated Tests (Backend)

To run the automated tests for the Flask backend APIs:

1.  Ensure you are in the `backend` directory.
2.  Ensure your Python virtual environment is activated.
3.  Run `pytest`:
    ```bash
    pytest
    ```
    The tests will execute and report success or failure.

## 🤔 Assumptions & Design Choices

* **In-Memory Data Store:** For simplicity and to meet the assessment's focus on APIs and frontend integration within a template context, tasks and comments are stored in Python dictionaries (`tasks` and `comments`) in `app.py`.
    * **Choice:** This avoids the overhead of setting up a database (e.g., PostgreSQL, SQLite) and ORM (e.g., SQLAlchemy), allowing concentration on core logic.
    * **Real-world:** In a production application, this would be replaced by a persistent database with a proper schema and data access layer.
* **UUIDs for IDs:** Comments are assigned unique UUIDs to ensure distinct identification, even with in-memory storage.
* **CORS Enabled:** `Flask-CORS` is used to allow the React frontend (running on `localhost:3000`) to communicate with the Flask backend (running on `127.0.0.1:5000`). This is essential for local development across different origins.
* **Basic Error Handling:** APIs return descriptive JSON error messages with appropriate HTTP status codes (e.g., 400 for bad requests, 404 for not found).
* **Simple Frontend State Management:** React's `useState` and `useEffect` hooks are used for local component state and data fetching. For a larger application, a more robust state management solution (e.g., Redux, React Context API, Zustand) would be considered.
* **No Authentication/Authorization:** User authentication and authorization are out of scope for this assessment. All API endpoints are publicly accessible.
* **Minimal UI/UX:** The frontend focuses on core functionality rather than complex styling or advanced user experience, leveraging Tailwind CSS for basic utility styling.

## 🚧 Trade-offs & Technical Debt

* **Non-Persistent Data:** As mentioned, data is lost when the Flask server restarts. This is the primary technical debt for a real-world application.
* **Basic Validation:** Input validation on the backend is minimal (e.g., checking for presence of `author` and `text`). More robust validation (e.g., length limits, character types, input sanitization to prevent XSS) would be crucial for a production system.
* **Scalability of In-Memory Store:** The current data storage mechanism is not suitable for concurrent access or large datasets.
* **No Dedicated Service Layer:** API logic is directly within Flask route functions. For larger projects, a separate service layer would enhance modularity and testability.
* **Limited Frontend Error Display:** While `setMessage` provides feedback, a more sophisticated error display (e.g., persistent toasts, specific error messages per field) could improve UX.
* **No Frontend Routing:** The application is a single page. In a multi-view application, React Router would be integrated.

## ✨ Future Improvements

* Integrate a **database** (e.g., PostgreSQL with SQLAlchemy) for persistent data storage.
* Implement **user authentication and authorization** to secure API endpoints.
* Add more comprehensive **input validation** on both frontend and backend.
* Improve **error handling** and logging mechanisms.
* Enhance **frontend UI/UX** with better styling, animations, and form validation.
* Implement a **dedicated service layer** on the backend to abstract database interactions.
* Add **frontend unit/integration tests** (e.g., using React Testing Library, Jest).

## 🚀 Submission Details

As per the assessment instructions, please find the required submission details below:

1.  **Links to separate PRs:**
    * **Task #1 PR (Backend APIs & Tests):** [Link to your Task 1 PR on your GitHub fork]
    * **Task #2 PR (Frontend Interface):** [Link to your Task 2 PR on your GitHub fork]

    *(Note: These PRs would be raised against your personal fork of the original template repository.)*

2.  **Short Video Walkthrough:**
    (a) **Your Approach:** Explain your thought process in designing the API endpoints and the frontend components.
    (b) **Key Decisions You Made:** Discuss choices like using in-memory data, Flask-CORS, and the structure of the React app.
    (c) **Any Trade-offs or Technical Debt You Took On:** Elaborate on the points mentioned in the "Trade-offs / Technical Debt" section above.

    [Link to your video walkthrough (e.g., unlisted YouTube video, Google Drive link, Loom link)]

---

Thank you for the opportunity to participate in this assessment.
