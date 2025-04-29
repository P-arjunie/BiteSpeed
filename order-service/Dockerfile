# Use official Node.js image
FROM node:22

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
