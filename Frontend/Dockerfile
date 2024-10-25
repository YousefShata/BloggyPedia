# Use Node.js image to build the app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code to the container
COPY . .

# Build the Nuxt app
RUN npm run build

# Use a lightweight Node.js image for serving the app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/.output ./

COPY .env ./
# Expose the port on which the frontend will run (optional but good practice)
EXPOSE 3000

# Set the command to run the app in preview mode
CMD ["node", "server/index.mjs"]
