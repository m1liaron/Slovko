FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install @expo/ngrok globally
RUN npm install -g @expo/ngrok

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
