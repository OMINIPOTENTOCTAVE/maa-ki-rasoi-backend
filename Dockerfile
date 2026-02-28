# Use Node.js 20 Alpine for a small, secure footprint
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production if possible)
RUN npm install

# Copy the backend source code and Prisma schema
# Note: We ignore the /apps folder via .dockerignore to keep the image small
COPY . .

# Generate the Prisma Client tailored for the Linux container
RUN npx prisma generate

# Expose the port Cloud Run will use
EXPOSE 5000

# Start the Node backend natively
CMD ["npm", "start"]
