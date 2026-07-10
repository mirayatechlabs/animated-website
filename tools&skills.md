# Project Tech Stack & AI Skills Blueprint

This document tracks all the tools, libraries, and AI skills initialized in this project. It serves as a blueprint for bootstrapping similar high-end animated web projects (e.g., Awwwards/FWA style sites).

## 1. AI Framework & Skills (oh-my-agent)

This project is built using the `oh-my-agent` SSOT (Single Source of Truth) architecture, allowing specialized AI agents to collaborate with strict guidelines.
- **Skills Directory**: `.agents/skills/` (contains all `oma-*` skills like `oma-frontend`, `oma-design`, `oma-architecture`, etc.).
- **Rule Architecture**:
  - `agents.md`: Core definitions for RBI (Role, Behavior, Intent), Rules, Brain, and Implementation.
  - `.agents/rules/sicurezza.md`: Strict security policies (e.g., no hardcoded secrets, mandatory input validation).
  - `.agents/implementation/`: Repository for code generation strategies and protocols.

## 2. Frontend & Build Tools

The foundation of the project favors performance and standard web technologies.
- **Build Tool**: [Vite](https://vitejs.dev/) (Vanilla JS Template)
- **Language**: Vanilla JavaScript, HTML5, CSS3.
- **Reasoning**: Vite provides lightning-fast HMR (Hot Module Replacement) and optimized builds without the overhead of heavy frameworks, which is perfect for WebGL and canvas-heavy sites.

## 3. Animation & 3D Libraries

To achieve top-tier visual experiences (inspired by agencies like Noomo, Lusion, and Refokus), the following dependencies are installed:
- **[GSAP (GreenSock)](https://gsap.com/)**: The industry standard for performant DOM animations, timelines, and scroll-triggered effects (`ScrollTrigger`).
- **[Three.js](https://threejs.org/)**: A robust WebGL framework used for rendering real-time interactive 3D models and dynamic shaders directly in the browser.
- **[Lenis](https://github.com/darkroomengineering/lenis)**: A lightweight, performant smooth scrolling library that harmonizes perfectly with native scrolling, GSAP, and WebGL.

## 4. Environment & Security
- **Git Config**: Standardized `.gitignore` to prevent leaking `node_modules`, OS files, or builds.
- **Secrets Management**: Configuration via local `.env` files that are strictly excluded from source control to adhere to `sicurezza.md`.

---
*Note for future setups: Remember to run `npm install` to restore the tools, and ensure `.agents/skills` are loaded into the AI workspace.*
