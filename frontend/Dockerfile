FROM node:21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install @expo/ngrok globally
RUN npm install -g expo/ngrok
RUN npm install -g expo-cli

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
