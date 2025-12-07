# AGENTS.md: Development Guide for Agents

This document provides guidance for AI agents working on this project.

## Project Overview

This is a web application with a Golang backend and an Angular frontend.

## Development Environment Setup

This project is configured to be used with a development container.

1.  **Prerequisites**: Ensure you have Docker and VS Code with the "Dev Containers" extension installed.
2.  **Open in Container**: Open the project folder in VS Code. You should be prompted to "Reopen in Container." Click it.
3.  **Rebuilding the Container**: If you make any changes to the files in the `.devcontainer` directory (like `Dockerfile`), you will need to manually rebuild the container for the changes to take effect. You can do this from the command palette (F1) by running "Dev Containers: Rebuild Container".

## Running the Frontend (Angular)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm start
    ```
The frontend will be available at `http://localhost:4200`. API requests to `/api` will be proxied to the backend at `http://localhost:8080`.

**Note:** The `npm start` command typically runs `ng serve`. For other Angular CLI commands (e.g., `ng generate`), you may need to use `npx` as the `ng` executable might not be in the default PATH (e.g., `npx ng generate component my-component`).

## Running the Backend (Go)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    go mod download
    ```
3.  **Run the server:**
    ```bash
    go run main.go
    ```
The backend server will start on `http://localhost:8080`.

**Note for Agents in Dev Container**: The `go run` command can sometimes be unreliable in the dev container. If you encounter issues, it is recommended to build the binary first and then execute it:
```bash
# Alternative for dev container
go build -o webapp .
./webapp
```

## Running Both (Convenience)

To run both the backend and frontend simultaneously with a single command:
```bash
make dev
```
This command starts both servers and handles cleanup when stopped (Ctrl+C).

## Production Build

For details on the production build process, where the Go binary serves the compiled Angular application, please refer to [DEVELOPMENT_DESIGN.md](./DEVELOPMENT_DESIGN.md).

## Known Issues & Notes

*   **`ng test` fails**: The devcontainer does not include a browser installation, which will cause `ng test` to fail. For now, running these tests is not considered a critical step.
