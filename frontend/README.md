# TaskMaster: A Full-Stack Task Management Application

This is a web-based task management system built with ASP.NET Core and React, created as a project for my online internship. It supports user authentication, role-based access, full CRUD operations for tasks, and includes professional backend features like logging, testing, and static analysis.

## Technology Stack
- **Backend:** ASP.NET Core 6, Entity Framework Core, Serilog
- **Frontend:** React.js, Styled-Components
- **Database:** SQL Server
- **Testing:** xUnit, Moq
- **Code Analysis:** SonarQube
- **Runtime:** Docker (for SonarQube)

## Key Features
- **Role-Based Access Control:** Differentiates between regular 'Users' (who can only manage their own tasks) and 'Admins' (who can manage all tasks and all users).
- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their tasks through a modern Kanban board interface.
- **Admin Panel:** A dedicated UI for administrators to view all users, change their active status, and manage their roles.
- **Secure API:** The backend API is secured using JWT (JSON Web Token) authentication.
- **Professional Backend:** Includes structured logging with Serilog, global exception handling, and a suite of unit tests.

---


### Clone the Repository
<!-- First, clone the project from GitHub to your local machine:
```bash
git clone https://github.com/shezarafiq/TaskMaster-10Pearls-Internship.git
cd TaskMaster-10Pearls-Internship -->


## How to Run This Project

### Prerequisites
- .NET 6 SDK
- Node.js (v16 or later)
- SQL Server (Express Edition is sufficient)
- Docker Desktop (for running SonarQube)

### 1. Backend Setup
1.  Navigate to the `backend` folder.
2.  Update the `DefaultConnection` string in `appsettings.json` if your SQL Server instance is different from `localhost\SQLEXPRESS`.
3.  Open a terminal in the `backend` folder and run the following commands to set up the database:
    ```bash
    dotnet ef database drop
    dotnet ef database update
    ```
4.  Run the backend server:
    ```bash
    dotnet run
    ```
The API will be running on `http://localhost:5209` (or a similar port). The database will be automatically seeded with a default admin account.

### 2. Frontend Setup
1.  Navigate to the `frontend` folder in a new terminal.
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Run the frontend development server:
    ```bash
    npm start
    ```
The application will be available at `http://localhost:3000`.

### Default Credentials
- **Admin Login:**
  - **Username:** `admin`
  - **Password:** `Admin@123!`
- **User Login:** You can create your own user through the Sign Up page.



## SonarQube Analysis Report
The project was analyzed using a local SonarQube instance. The analysis was successful and the project **passed the Quality Gate**.

**Overview:** The analysis found **0 Bugs** and **0 Vulnerabilities**, with an 'A' rating for both Reliability and Security.

![SonarQube Overview](analysis/sonarqube-overview.png)

