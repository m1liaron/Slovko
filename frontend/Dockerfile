FROM node:20-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first to leverage Docker's layer caching
COPY package*.json ./
RUN npm ci

# Use 'npm ci' for faster, more reliable installs in CI/Docker
RUN npm ci

# Copy the rest of the app
COPY . .

EXPOSE 8081

# Default to LAN mode (much faster than tunnel)
CMD ["npx", "expo", "start", "--host", "lan"]