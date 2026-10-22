# ⚡ WordSnap Game

เว็บเกมตอบคำศัพท์คอมพิวเตอร์ภาษาอังกฤษ กว่า 215 คำ ครอบคลุม Hardware, Software, Networking และ Programming

## 🎮 Game Modes

- **Abbreviation Snap** - พิมพ์ชื่อเต็มจากคำย่อ (เช่น CPU → Central Processing Unit)
- **Definition Match** - เลือกคำตอบจาก 4 ตัวเลือก
- **Speed Round** - ตอบให้ได้มากที่สุดใน 60 วินาที

## 🛠️ Tech Stack

- **Next.js** - React Framework
- **Supabase** - Database & Backend
- **Vercel** - Hosting & Deployment

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase URL and Anon Key.

### 3. Setup Supabase database
Run `supabase_setup.sql` in your Supabase SQL Editor to create tables and seed 215 vocabulary terms.

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Features

- 🔥 Streak bonus scoring system
- ❤️ Lives system with 3 hearts
- 💡 Hint system (shows first letters)
- ⏱️ Timer per question
- 🏆 Leaderboard (stored in Supabase)
- 🎉 Confetti animations on correct answers
- 📱 Responsive design
- 🌙 Dark mode with neon glow effects
