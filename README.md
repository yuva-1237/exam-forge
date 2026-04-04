# 🧠 Exam Forge: Premium Educational Architecture

**Exam Forge** is a state-of-the-art full-stack quiz platform designed for high-performance learning. It combines a rigorous testing environment with a modern, immersive UI/UX inspired by contemporary **Bento Box** design patterns and **Glassmorphism**.

---

https://yuva-1237.github.io/exam-forge/

## 💎 Premium Design System

The platform has been meticulously crafted with a "Deep Indigo & Radiant Violet" aesthetic, focusing on visual hierarchy and cognitive ease.

### 🎨 Visual Language
- **Bento Box Layout**: The Dashboard and Features are organized into discrete, functional "tiles" that prioritize information density without clutter.
- **Glassmorphism**: Custom `.glass` and `.glass-card` utility classes utilize backdrop-blurs and semi-transparent HSL overlays to create a sense of depth and a premium finish.
- **Vibrant Glows**: Strategic use of animated HSL glows and `text-glow` utilities draw attention to critical metrics and interactive elements.
- **Micro-Animations**: Staggered entry animations via `framer-motion` provide a sense of life and responsiveness to every page transition.

### 🌓 Dynamic Theming
- **Forced Dark Mode**: A curated palette of `hsl(250, 24%, 9%)` for backgrounds and `hsl(263, 70%, 50%)` for primary accents ensures a high-contrast, professional environment.

---

## ⚡ Core Architecture

### 🌐 Real-Time Ecosystem
- **Global Network Chat**: A persistent `Socket.io` powered communication hub allowing agents (students) to synchronize and discuss tracks in real-time.
- **Live HUMOR.sys**: An automated rotation of programmer humor updating every 60 seconds to maintain engagement.

### 🛠️ Technical Stack
- **Frontend**: Vite + React 18 + TypeScript + TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide-React
- **Routing**: `HashRouter` (Optimized for GitHub Pages compatibility)
- **Concurrency**: `concurrently` manages the frontend and backend with a single command.

---

## 🚀 Deployment Pipeline

Exam Forge utilizes a robust **GitHub Actions CI/CD** pipeline.

1.  **Automated Build**: Every push triggers a production build.
2.  **Continuous Deployment**: Successful builds are automatically deployed to the `gh-pages` branch.
3.  **Subpath Awareness**: Configured with `base: '/exam-forge/'` for seamless subdirectory hosting.

---

## 🏁 Getting Started

Follow these steps to set up the Forge on your local machine:

1. **Clone & Setup**:
   ```bash
   git clone https://github.com/yuva-1237/exam-forge.git
   cd exam-forge
   npm install
   ```

2. **Initialize Forge**:
   This starts both the **Vite Dashboard** and the **Socket.io Core** simultaneously.
   ```bash
   npm run dev
   ```

3. **Access Protocol**:
   - URL: `http://localhost:8080`
   - Admin: `admin@mcq.com` / `Admin123!`

---

*Developed with ❤️ by the Exam Forge Architecture Team.*
