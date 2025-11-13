# 📚 Slovko – Learn Foreign Words with Smart Repetition and Fun Game Modes

FlashCards is a modern mobile app built to help you master foreign words—or any kind of facts—efficiently and enjoyably. Whether you're learning English, German, or any subject matter, FlashCards offers a customizable and interactive experience to boost your memory using scientifically-backed methods.

## How to start with app
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (recommended: latest LTS version)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/):  
  ```bash
  npm install -g expo-cli
  Git
  A smartphone with the Expo Go app (iOS/Android) or an emulator/simulator.

## 🚀 Getting Started
1. **Install dependencies:**

   ```bash
   cd frontend
   
   npm install
   # or
   yarn

   cd backend
   npm i
   ```
   
2. **Start the development server:**

   ```bash
   expo start
   
   # open other terminal for backend
   cd server
   npm run dev
   ```

   This will open the Expo Developer Tools in your browser. You can scan the QR code with Expo Go or run the app in a simulator or in web.
2. **(Optional) create certificates for https server:**

   ```bash
   mkdir certs
   cd certs
   openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365

   ```

   This will create certificates in certs folder.

# ✨ Key Features

### 🗂️ Grouped Learning
- **Custom Groups & Cards**: Organize words into thematic groups.
- **Rich Card Content**: Each card includes:
  - **Word**
  - **Translation**
  - **Definition**
  - **Example Sentence**
  - **Optional Image**

### 🎮 Game-Based Learning Modes
- 4 unique learning modes to keep studying fun and engaging:
  - **FlashCards** – Classic memory-boosting flip mode
  - **Quiz** – Choose the right answer from options
  - **Write word** – Write word by given letter
  - **Match Mode** – Select right translation for word

### ⏳ Smart Repetition (Ebbinghaus System)
- Words are scheduled for repetition based on Ebbinghaus forgetting curve.
- A button on the home screen reminds you when it's time to review.

### 📊 Analytics & Progress Tracking
- **Results History** – Track how you performed during past sessions.
- **Streak System** – Keep the momentum going with daily practice.
- **Detailed Statistics** – Visualize your strengths and weak spots.

### 🌙 Themes & Personalization
- Toggle between **Dark** and **Light** themes to match your preference.

### 📥 Import & Export
- Import word lists via `.txt` or `.xlsx` files.
- Easily move content between devices or collaborate with friends.

---

## Share cards
- You can easily share your deck of cards with your friends

## 🚀 Upcoming Features / Ideas

Based on competitive analysis of popular apps like Anki, Quizlet, and Memrise, here are some ideas we will add:

- ✅ **Audio Support** (TTS) for pronunciation practice  
- ✅ **Sync & Cloud Backup** (e.g., Firebase)  
- ✅ **Daily Goals** – Set how many cards to learn/review daily  
- ✅ **Gamification** – XP, levels, badges  
- ✅ **Challenge Mode** – Timed quiz for extra difficulty  
- ✅ **Notifications** – Smart reminders to review at optimal times  
- ✅ **Offline Mode** – Learn anywhere, anytime  
- ✅ **Multiple Languages per Word** (for trilingual learners)  
- ✅ **Spaced Repetition Visualization** – Calendar or chart showing upcoming reviews

---

## 📸 Screenshots
<!-- Add screenshots or demo GIFs here -->
![screenshot1](./screenshots/home.png)
![screenshot2](./screenshots/learn-mode.png)

---

## 🛠️ Tech Stack

- **React Native + Expo**
- **TypeScript**
- **Redux Toolkit**
- **AsyncStorage**
- **Charting** – (e.g., VictoryNative or Recharts)
- **Ebbinghaus Repetition Logic** – Custom scheduling algorithm

---

## 🧠 Why FlashCards?

Most flashcard apps either overwhelm with complexity or lack proper memory techniques. FlashCards offers:
- Clean UI
- Scientific approach (Ebbinghaus)
- Flexible card customization
- Stats-driven progress tracking

---
