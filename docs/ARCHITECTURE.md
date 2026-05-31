# Jatashankar Project Architecture

Jatashankar is a modern, enterprise-scale educational healthcare website platform. This repository is structured as a decoupled multi-project workspace to ensure independent scaling, modular design, and robust deployment pipelines.

## Repository Layout

```
jatashankar/
├── frontend/                     # Public Educational Healthcare Website (Next.js 15)
├── admin/                        # Administrative Panel & Dashboard (Next.js 15)
├── firebase/                     # Firebase Infrastructure configurations (Rules, Indexes)
├── docs/                         # System Design, Data Models, and User Manuals
└── assets/                       # Branding guides, raw designs, SVGs, and fonts
```

---

## 1. Frontend Workspace (`/frontend`)

The primary frontend workspace is built on **Next.js 15 (App Router)** and **TypeScript**, powered by **Tailwind CSS** for layout styling, and **Framer Motion** for animations.

### Source Directory Structure (`/src`)

- **`app/`**: Next.js App Router folders. Contains root layouts, pages, loading indicators, and error boundary components. Keep pages thin; delegate layouts and content rendering to `sections` and `layouts`.
- **`components/`**: Reusable component elements.
  - `ui/`: Stateless base design primitives (buttons, inputs, skeleton loaders, modals).
  - `common/`: Global shell components (Navbar, Footer, Sidebar, Cookie Banner).
- **`sections/`**: Modular page sections (e.g. `Hero.tsx`, `FeatureGrid.tsx`, `CourseOverview.tsx`). This prevents individual page files from becoming overly complex and allows sections to be rearranged easily.
- **`layouts/`**: Wrappers and template shells (e.g., Auth-protection wrappers, standard article layouts).
- **`hooks/`**: Global custom React hooks (e.g. `useAuth`, `useLocalStorage`, `useMediaQuery`).
- **`services/`**: API wrapper services and third-party integrations (Firebase DB clients, payment gateways).
- **`utils/`**: Deterministic helper utilities (formatters, data validators, mathematical engines).
- **`styles/`**: Global style guidelines. Contains `globals.css` with core Tailwind imports and root design variables.
- **`constants/`**: Unchanging configuration values (navigation hierarchies, branding settings, API routes).
- **`animations/`**: Custom Framer Motion transition configurations (fade, slide, stagger presets).
- **`data/`**: Static datasets used locally (e.g., local state mock data, text translations).

---

## 2. Admin Workspace (`/admin`)

The admin control panel mirrors the frontend's tech stack (Next.js 15 + TS + Tailwind + Framer Motion) to minimize cognitive load for developers context-switching between user and administrative environments.

It uses a distinctive **violet-based theme** to distinguish it from the **teal-based public portal**. It handles user accounts, course enrollments, system logs, content updates, and medical validation flows.

---

## 3. Infrastructure & Backend (`/firebase`)

The backend functions on Firebase Serverless offerings:
- **Firestore**: Scalable NoSQL database (Rules configured in `firebase/firestore.rules`).
- **Firebase Auth**: Identity management.
- **Cloud Storage**: Secure media uploads (Rules in `firebase/storage.rules`).
- **Local Emulators**: Run full databases locally (Ports defined in `firebase/firebase.json`).

---

## 4. Design Guidelines

To maintain a premium, state-of-the-art visual style, developers must adhere to the following principles:
- **Glassmorphism**: Use the `.glass-effect` utility class for overlays, headers, and dashboard widgets.
- **Micro-Animations**: All interactive items (cards, buttons, icons) must support hover-lifts (`.hover-lift`) or smooth click actions via Framer Motion spring presets.
- **Harmony**: Use the specified teal accents (`#14b8a6`) for public health components and violet accents (`#8b5cf6`) for admin components.
- **Typography**: Utilize Google Fonts Inter/Outfit via Next.js Font loading. Do not fallback to standard browser serif fonts.

---

## 5. Getting Started

### Development
1. Run the Firebase emulators:
   ```bash
   cd firebase && firebase emulators:start
   ```
2. Run the frontend development server:
   ```bash
   cd frontend && npm run dev
   ```
3. Run the admin portal:
   ```bash
   cd admin && npm run dev
   ```

### Production Build
Validate code compiles with strict type safety before commits:
```bash
npm run build
```
