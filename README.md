# Atoms & Molecules

Interactive 3D visualization of atomic structure showing protons, neutrons, and electrons in their orbital shells. Explore multiple elements with stunning visual effects.

## Features

- **3D Atom Visualization** - Real-time rendering of nucleus and electron orbits
- **Multiple Elements** - Switch between Hydrogen, Helium, Carbon, Oxygen, Iron, and Gold
- **Interactive Controls** - Adjust rotation speed, glow intensity, and particle effects
- **Scientifically Accurate** - Proper electron shell configuration and particle counts
- **Beautiful Effects** - Bloom lighting, particle fields, and smooth animations

## Tech Stack

**Frontend:**
- Vite + React + TypeScript
- Three.js with @react-three/fiber and @react-three/drei
- @react-three/postprocessing for visual effects
- Zustand for state management
- Leva for control panel

**Backend:**
- Node.js + Express
- REST API for atom data

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Backend
```bash
cd backend
npm install
npm run dev
```
API runs on http://localhost:3001

## Project Structure
```
.
├── frontend/           # React + Three.js visualization
│   ├── src/
│   │   ├── components/ # 3D components (Nucleus, Electrons, etc)
│   │   ├── data/       # Atom configurations
│   │   └── hooks/      # Zustand store
├── backend/            # Express API
│   ├── data/           # Atom database
│   └── server.js       # API endpoints
└── README.md
```

## Controls

- **Drag** - Rotate the atom
- **Scroll** - Zoom in/out
- **Leva Panel** - Adjust rotation speed, glow, and particles
- **Element Buttons** - Switch between different atoms
