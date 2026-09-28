# Apex Racing Simulator

A lightweight Formula 1-inspired racing garage and telemetry demo built with React, Vite, and React Three Fiber. The app presents a 3D car viewer, live tire telemetry, setup controls, and a stylized race simulation interface.

## Overview

This project simulates a track-side garage experience where users can:

- switch between tire compounds
- adjust brake balance and aero profile
- start or pause a simulated race session
- monitor tire temperature, wear, and pressure
- orbit around a 3D Formula 1-inspired car model
- view a simplified telemetry chart and session metrics

## Features

- 3D interactive car model using React Three Fiber
- responsive racetrack and garage UI
- tire temperature, pressure, and degradation analysis
- live lap timing and speed simulation
- keyboard controls for throttle and ignition
- fullscreen viewer support
- reset and session controls

## Tech Stack

- React 19
- Vite
- Three.js
- @react-three/fiber
- @react-three/drei
- lucide-react

## Project Structure

```bash
.
+-- index.html
+-- package.json
+-- README.md
+-- src/
¦   +-- App.jsx
¦   +-- main.jsx
¦   +-- style.css
+-- public/
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```bash
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Controls

- Space: start/pause the session
- W / Arrow Up: increase speed
- S / Arrow Down: reduce speed
- Mouse drag: orbit around the 3D model

## Notes

This project is a front-end demo and is intended for visual simulation and UI exploration rather than a full racing simulation engine.

## License

This project is provided for educational and demonstration purposes.
