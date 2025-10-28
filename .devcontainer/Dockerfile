# Use the official Golang image as a base image
FROM golang:1.23.0

# Install system dependencies, including Node.js, npm, and sudo
# See https://github.com/nodesource/distributions#debinstall
RUN apt-get update && apt-get install -y ca-certificates curl gnupg sudo
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Create a non-root user 'vscode' with sudo permissions
# and create a home directory.
RUN useradd -m -s /bin/bash -G sudo vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode

# Set the working directory. This directory is created as root.
WORKDIR /workspace

# Change ownership of the workspace and Go module cache to the vscode user.
# This ensures that the user can write to the project files mounted
# in /workspace and also to the Go module cache.
RUN chown -R vscode:vscode /workspace /go

# Expose ports for Go and Angular development servers
EXPOSE 8080 4200

# Switch to the non-root user.
USER vscode
