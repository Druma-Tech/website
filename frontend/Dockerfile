# Use Node.js as the base image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the Vite app
RUN npm run build

# Install a lightweight HTTP server
RUN npm install -g serve

# Expose frontend port
EXPOSE 5173

# Start the frontend server
CMD ["serve", "-s", "dist", "-l", "5173"]
