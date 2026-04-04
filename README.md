# 🧠 Exam Forge: The Ultimate Full-Stack Quiz Platform

**Exam Forge** is a premium, modern, and highly interactive quiz platform designed to provide a production-grade learning experience. It combines a sleek, glassmorphic UI with a powerful backend to offer real-time features, comprehensive subject coverage, and an engaging user journey.

---

## 🚀 Key Features & Functionality

### 🌐 1. Real-Time Full-Stack Integration
Exam Forge isn't just a static site. It features a dedicated **Node.js & Socket.io server** that powers:
- **Global Live Chat**: Connect with other students instantly. Discuss questions, share tips, and build a community in real-time.
- **Live Status Tracking**: The platform tracks user connectivity, providing a "living" dashboard experience.
- **Message History**: The backend maintains a rolling buffer of recent messages so you never miss a beat.

### 📚 2. Massive Educational Library
We've scaled the platform to cover a wide array of technical and creative subjects:
- **20+ Specialized Categories**: Software Engineering (JavaScript, Python, C++, TypeScript), Databases (MySQL, PostgreSQL), Mobile (Swift, Kotlin), and Design (Figma, Photoshop).
- **Quality Questions**: Each subject is seeded with 10 challenging, high-quality questions.
- **Official Branding**: Every subject features official high-definition SVG icons from the **Devicon** library.

### 🎭 3. Dynamic Engagement Tools
- **Programmer Humor Widget**: To keep the learning process light, we've integrated a "Joke of the Minute" widget. It automatically rotates through a database of **100+ developer-focused jokes** every 60 seconds.
- **Interactive Custom Cursor**: Experience the "Frosted Lens" — a custom 3D magnifying glass cursor that uses advanced CSS filters (brightness, contrast, and saturation) to highlight and "light up" the content beneath it.

### 📊 4. Competitive & Analytical Engine
- **Timed Exams**: Each quiz features a professional countdown timer and anti-cheat mechanisms (like tab-switch detection).
- **Personalized Dashboard**: Track your total score, average accuracy, and best-performing categories with beautiful **Recharts** visualizations.
- **Global Leaderboard**: See where you stand against the Exam Forge community.

---

## 🎨 Premium Design System

Exam Forge is built with a deep focus on **Aesthetics and UX**:
- **Default Dark Mode**: A sophisticated, high-contrast dark theme designed for long study sessions.
- **Glassmorphism**: Transparent, blurred backgrounds and subtle borders create a "premium frost" feel across all cards and modals.
- **Spring Physics Animations**: Powered by **Framer Motion**, every interaction feels "alive" with smooth transitions and subtle micro-animations.

---

## 🛠️ Technical Architecture

### **Frontend**
- **Framework**: React 18 with Vite (for lightning-fast builds).
- **Language**: TypeScript (ensuring robust, type-safe code).
- **Styling**: Tailwind CSS for a utility-first, responsive design.
- **Animations**: Framer Motion for high-fidelity motion design.
- **Data Fetching**: TanStack Query (React Query) for efficient state management.

### **Backend**
- **Engine**: Node.js & Express.
- **Real-Time**: Socket.io for bi-directional, low-latency communication.
- **Process Management**: `concurrently` is used to run the frontend and backend with a single command.

### **DevOps**
- **CI/CD**: Automated GitHub Actions pipeline (`deploy.yml`) that builds and deploys the production bundle automatically on every push.

---

## 🏁 Getting Started

Follow these steps to set up Exam Forge on your local machine:

1. **Clone & Install**:
   ```bash
   git clone https://github.com/yuva-1237/exam-forge.git
   cd exam-forge
   npm install
   ```

2. **Launch the Forge**:
   This will start both the **Vite Development Server** and the **Socket.io Backend** simultaneously.
   ```bash
   npm run dev
   ```

3. **Enjoy the Experience**:
   - Open your browser to: `http://localhost:8080`
   - Access the admin panel with: `admin@mcq.com` / `Admin123!`

---

Built with Passion for Better Learning. 🧠💻
