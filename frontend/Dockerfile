FROM node:20-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8081

# Default to LAN mode (much faster than tunnel)
CMD ["npx", "expo", "start", "--host", "lan"]