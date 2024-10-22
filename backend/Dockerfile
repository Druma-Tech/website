# Step 1: Use Node.js image
FROM node:18

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the port (adjust if different)
EXPOSE 5000

# Step 7: Start the backend
CMD ["npm", "start"]
