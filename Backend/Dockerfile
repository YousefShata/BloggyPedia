# Use a Node.js image to install dependencies and build the backend
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the entire backend source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a smaller Node.js image for the final stage
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Copy only the necessary dependencies for production
COPY package*.json ./
RUN npm install --only=production

# Copy other necessary files (like environment variables)
COPY .env ./

# Expose the backend port (optional)
EXPOSE 5000

# Start the backend
CMD ["node", "dist/index.js"]