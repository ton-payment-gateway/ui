# Dockerfile

# Use an existing node alpine image as a base image.
FROM node:20-alpine

# Install Python and other necessary tools
RUN apk add --no-cache python3 make g++

# Set the working directory.
WORKDIR /app

# Copy the package.json file.
COPY package.json .

# Copy the package-lock.json file.
COPY package-lock.json .

# Copy the rest of the application files.
COPY . .

# Install application dependencies.
RUN npm install

# Expose the port.
EXPOSE 3000

USER root
RUN npm install -g serve
RUN npm run build

# Run the application.
CMD ["npm", "run", "start:prod"]