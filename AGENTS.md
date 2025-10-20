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
    npx ng serve
    ```
    **Note:** The Angular CLI (`ng`) is not in the default PATH. You must use `npx` to run Angular CLI commands.

The frontend will be available at `http://localhost:4200`. API requests to `/api` will be proxied to the backend at `http://localhost:8080`.

## Running the Backend (Go)

The `go run` command can be unreliable and may time out in this devcontainer. It is recommended to build the binary first and then execute it.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Build the binary:**
    ```bash
    go build -o webapp .
    ```
3.  **Run the executable:**
    ```bash
    ./webapp
    ```

The backend server will start on `http://localhost:8080`.

## Production Build

For details on the production build process, where the Go binary serves the compiled Angular application, please refer to [DEVELOPMENT_DESIGN.md](./DEVELOPMENT_DESIGN.md).

## Known Issues & Notes

*   **`ng test` fails**: The devcontainer does not include a browser installation, which will cause `ng test` to fail. For now, running these tests is not considered a critical step.
