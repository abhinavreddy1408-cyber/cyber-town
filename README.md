# CyberTown: Interactive Cybersecurity Defense Simulation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFA611.svg?logo=firebase)](https://firebase.google.com/)

<div align="center">
  <img width="100%" alt="CyberTown Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**CyberTown** is a gamified cybersecurity strategy and defensive operations simulator. Built with React, TypeScript, and Firebase, it models security infrastructure evolution, real-time threat incident scenarios, and operational risk trade-offs.

---

## 🎯 Gameplay & Simulation Modes

* **🛡️ Action Mode:** Allocate security capital and deploy defense countermeasures to harden vulnerable attack vectors.
* **⚡ Consequence Mode:** Evaluate post-incident ramifications, assessing data breaches, financial penalties, and system downtime under varying defensive postures.
* **🌐 Simulation Mode:** Run simulated adversary campaigns across tiered architectural stages (from local homelab to enterprise cloud hub and multi-tenant skyscraper).
* **📈 Real-Time Game Engine:** Powered by Zustand state management tracking security credits, defense levels, shift timers, and persistent profile progression via Firebase Authentication and Firestore.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
* **State Management:** Zustand (`useGameStore`)
* **Backend & Auth:** Firebase Authentication, Cloud Firestore
* **Build & Tooling:** Vite, ESLint, PostCSS

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* npm or pnpm

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/abhinavreddy1408-cyber/cyber-town.git
cd cyber-town
npm install
```

### 2. Configure Firebase Credentials

Create `.env.local` in the project root:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Launch Development Server

```bash
npm run dev
```

The game simulator will be running at `http://localhost:5173`.

---

## 📂 Project Structure

```
cyber-town/
├── src/
│   ├── components/         # Shared UI components and FirebaseProvider
│   ├── features/
│   │   ├── action-mode/    # Defense allocation and countermeasure controls
│   │   ├── consequence-mode/ # Post-breach impact analysis views
│   │   └── simulation-mode/# Real-time threat timeline simulation
│   ├── lib/                # Firebase initialization & client setup
│   ├── store/              # Zustand global game store (useGameStore.ts)
│   ├── App.tsx             # Root router and layout container
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global stylesheet and Tailwind directives
├── firestore.rules         # Security rules for Firestore persistence
├── package.json
└── vite.config.ts
```

---

## 🔮 Future Improvements

- [ ] Incorporate MITRE ATT&CK framework mapping for defense actions.
- [ ] Add multiplayer red-team vs. blue-team scenario battles.
- [ ] Integrate post-quantum cryptographic upgrade modules into the architecture progression tree.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 📬 Contact

**Abhinav Reddy** — [@abhinavreddy1408-cyber](https://github.com/abhinavreddy1408-cyber)  
Project Link: [https://github.com/abhinavreddy1408-cyber/cyber-town](https://github.com/abhinavreddy1408-cyber/cyber-town)
