# Use Node.js Alpine base image
FROM node:18-alpine3.18

# Create and set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install build tools and dependencies, ensuring bcrypt is built from source
RUN npm install

COPY . .

EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
