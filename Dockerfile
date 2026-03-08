FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

ENV PORT=8080
ENV TZ=Asia/Kolkata

CMD ["node", "src/server.js"]
