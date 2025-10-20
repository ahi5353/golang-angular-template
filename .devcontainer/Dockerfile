# Use the official Golang image as a base image
FROM golang:1.23.0

# Install Node.js, npm, and Angular CLI
# See https://github.com/nodesource/distributions#debinstall
RUN apt-get update && apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs
RUN npm install -g @angular/cli

# Set the working directory for the Go application
WORKDIR /workspace

# Expose ports for Go and Angular development servers
EXPOSE 8080 4200
