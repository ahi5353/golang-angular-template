# Use an official Node.js runtime as a parent image
FROM node:20.11.0

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 4200 to the outside world
EXPOSE 4200

# Run the app when the container launches
CMD ["npm", "start"]
