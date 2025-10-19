# Use the official Golang image as a base image
FROM golang:1.23.0

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the local package files to the container's workspace
COPY . .

# Install any needed packages and dependencies
RUN go get -d -v ./...
RUN go install -v ./...

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["app"]
