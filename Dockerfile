# Use an official Node.js runtime as a parent image
FROM node:16-alpine3.11

# Set the working directory in the container
WORKDIR /usr/src/app

# Install bash
RUN apk --no-cache add bash

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Inform Docker that the container listens on the specified network ports
EXPOSE 3000

# Run the application
CMD ["ash", "-c", "npm start"]
