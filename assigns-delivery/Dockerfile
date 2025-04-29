# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Expose app port
EXPOSE 3010

# Start app
CMD ["npm", "start"]
