# Assignment Tracker Application

## Description

This project is a Classwork Tracking System, developed as a Single Page Application (SPA) using React and Vite for the frontend, and Node.js with Express for the backend REST API. It allows users to manage their academic assignments effectively.

Users can register for an account (usernames only, no passwords) and log in to manage their personal list of assignments. Key functionalities include adding, viewing, editing details (title, subject, due date, description), marking assignments as complete or incomplete, and deleting assignments.

The application provides features to filter assignments by completion status or subject, sort them by due date, title, or subject, and perform a client-side keyword search across assignment details. A dashboard displays statistics about the user's progress, including total, completed, pending assignments, completion rate, upcoming and overdue tasks, and a breakdown by subject. The assignment list and statistics automatically update via polling.

A special 'admin' user role exists with features for managing subjects and viewing/managing all user data through a comprehensive Admin Panel with different tabs for various management functions.

This project demonstrates proficiency in building modern web applications, including React component structure, state management (`useState`, `useReducer`), handling asynchronous operations with Promises (`fetch` without `async/await`), RESTful API design with Express, session management using cookies, input validation (frontend and backend), and adherence to specific project constraints like avoiding routing libraries and certain external dependencies.

## Features

* **User Authentication:**
    * User Registration (Username only, 'dog' username restricted)
    * User Login (Username only)
    * Session management using secure cookies (`sid`)
* **Assignment Management (Per User):**
    * View assignment list
    * Add new assignments (via the "Add New Assignment" toggle button below the assignment list)
    * Edit assignment details (Title, Subject, Due Date, Description)
    * Toggle assignment completion status
    * Delete assignments (with confirmation dialog)
* **Assignment Display & Interaction:**
    * Shows assignment title, subject, due date, description.
    * Visual status indicators (Completed, Pending, Due Soon, Overdue) based on completion status and due date.
    * Highlight newly added assignment.
* **Filtering, Sorting, Searching:**
    * Filter by status: All, Pending, Completed.
    * Filter by subject (dynamic list fetched from server).
    * Sort by Due Date (default), Title, Subject.
    * Client-side keyword search (searches title, description, subject).
* **Statistics Dashboard:**
    * Displays Total, Completed, Pending, Due Soon, Overdue assignments.
    * Shows overall Completion Rate (%).
    * Visualizes progress per subject (Completion count and percentage).
* **Real-time Updates:**
    * Uses polling (every 5 seconds) to automatically refresh assignment list and statistics when logged in.
* **Admin Features:**
    * 'admin' user has distinct privileges.
    * Add new subjects (accessible via the Edit Assignment form for admin).
    * Delete subjects.
    * View assignments across all users.
    * Update/Delete any user's assignment.
    * View global application statistics.
* **General:**
    * Responsive design for usability on different screen sizes.
    * Clear error message reporting to the user.

## Tech Stack

* **Frontend:** React (v19), Vite, JavaScript (ES Modules), CSS (with CSS Variables)
* **Backend:** Node.js, Express (v5)
* **API:** RESTful API
* **Styling:** Plain CSS (Component-based files)
* **State Management:** React Hooks (`useState`, `useReducer`, `useEffect`, `useRef`, `useCallback`)
* **Session Management:** HTTP Cookies (`cookie-parser`)

## How to Run the Project

1.  **Clone the repository:**
    ```bash
    # Replace [repository-url] with the actual URL
    git clone [repository-url]
    cd [project-directory-name]
    ```
2.  **Install dependencies:** This installs both backend and frontend dependencies listed in `package.json`.
    ```bash
    npm install
    ```
3.  **Build the frontend application:** This bundles the React code into the `./dist` directory.
    ```bash
    npm run build
    ```
4.  **Start the server:** This command starts the Node.js/Express server defined in `server.js`. The server handles API requests and serves the static frontend files from `./dist`.
    ```bash
    npm start
    ```
5.  **Access the application:** Open your web browser and navigate to `http://localhost:3000` (or the port number shown in the console if different).

## How to Use the Application

1.  **Register:** On the initial screen, click the "Register Now" button. Enter a unique username (only letters, numbers, and underscores are allowed; 'dog' is forbidden) and click "Register". You will be logged in automatically.
2.  **Login:** If you already have an account, enter your username on the login screen and click "Login".
3.  **Main View (Logged In):**
    * **Header:** Shows the application title and your username (with an "Admin" badge if logged in as 'admin').
    * **Controls:** Contains the "Logout" button. If logged in as 'admin', an "Admin Panel" button appears.
    * **Dashboard:** Displays your assignment statistics.
    * **Filters & Sorting:** Click this section to expand options. You can filter by status, subject, search by keyword, and change the sorting order. The list updates automatically.
    * **Assignment List:** Shows your assignments based on current filters and sorting.
        * **Checkbox:** Toggle completion status.
        * **Pencil Icon:** Opens the edit form for that assignment.
        * **Trash Icon:** Deletes the assignment after confirmation.
    * **Adding Assignments:** Scroll to the bottom of the assignment list to find the "Add New Assignment" button. Click it to expand the form, fill in the details, and click "Add Assignment".
    * **Edit Form:** Modify assignment details. Admins can also add new subjects directly from this form. Click "Save Changes" or "Cancel".
4.  **Admin Panel:** If logged in as 'admin', you can access the Admin Panel which includes tabs for viewing all users' assignments, managing subjects, and viewing system-wide statistics.
5.  **Logout:** Click the "Logout" button in the controls section.

## Admin User

* A predefined user with administrative privileges is **`admin`**.
* Log in with the username `admin` to gain access to admin features.
* The Admin Panel provides three tabs:
  * **All Assignments**: View and manage assignments from all users
  * **Subject Management**: Add and delete subjects
  * **System Stats**: View system-wide statistics including user counts and assignment completion rates

## Assets and Licensing

* **SVG Icons:** The icons used in the `src/assets` directory (`account.svg`, `add.svg`, `admin.svg`, `assignment.svg`, `back.svg`, `delete.svg`, `down.svg`, `edit.svg`, `error.svg`, `forward.svg`, `login.svg`, `logout.svg`, `new.svg`, `pending.svg`, `person.svg`) are sourced from **[Google Material Symbols (available at https://fonts.google.com/icons)]** and are licensed under the **[Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0.txt) ]**. 

* **Other Libraries:** This project uses standard libraries installed by Vite/React and Express, as well as `cookie-parser`. All dependencies and their licenses are listed in the `package.json` file. No external libraries requiring special approval were used.

## Known Issues / Limitations

* **Client-Side Operations:** Searching, sorting, and pagination are currently performed client-side within the fetched data set due to backend limitations. The backend API for assignments does not support server-side pagination or keyword search parameters.
* **Browser Navigation:** The application does not reliably handle browser back/forward button navigation, as per project requirements disallowing the use of routing libraries like `react-router`. Application state is managed internally.
