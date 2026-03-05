# Use Node.js 20 slim
FROM node:20-slim

# Install system dependencies
# openssl for Prisma, python3/make/g++ for native builds if needed
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
# We use --production to skip devDependencies, but we need prisma CLI to generate client
# If prisma is in devDependencies, we might need a different approach.
# In your package.json, prisma is in dependencies. Correct.
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure prisma client is generated for the current platform
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
