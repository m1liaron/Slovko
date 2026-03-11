# Use a slim LTS version for faster pulls and smaller footprint
FROM node:20-slim

# Install system dependencies needed for some native modules or ngrok
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first to leverage Docker's layer caching
COPY package*.json ./

# Use 'npm ci' for faster, more reliable installs in CI/Docker
RUN npm ci

# Copy the rest of the app
COPY . .

# No need to install expo-cli globally. npx will handle it.
EXPOSE 8081

# Default to LAN mode (much faster than tunnel)
CMD ["npx", "expo", "start", "--host", "lan"]