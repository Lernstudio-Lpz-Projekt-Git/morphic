# Morphic — Vue 3 + TypeScript Partikel-Kunst

Interaktives Partikel-Kunstwerk mit Vue 3, TypeScript und Canvas 2D.

## Projektstruktur

```
morphic/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.ts                     # App-Einstiegspunkt
    ├── App.vue                     # Root-Komponente + globale Styles
    ├── types/
    │   └── index.ts                # TypeScript Interfaces
    ├── composables/
    │   ├── useParticles.ts         # Canvas-Animation & Partikel-Logik
    │   └── useClock.ts             # Echtzeit-Uhr
    └── components/
        ├── ControlPanel.vue        # Linkes Steuerungspanel
        └── InfoPanel.vue           # Rechtes Infopanel
```

## Setup & Start

```bash
npm install
npm run dev
```

Dann im Browser öffnen: `http://localhost:5173`

## Build für Produktion

```bash
npm run build
npm run preview
```

## Vue 3 Features

| Feature              | Wo verwendet                          |
|----------------------|---------------------------------------|
| `ref` / `reactive`   | Partikelkonfig, Mausposition          |
| `computed`           | Dichte, Maus-Prozent, aktuelles Zitat |
| `watch`              | Partikelanzahl, Geschwindigkeit       |
| `defineModel`        | Zwei-Wege-Binding in ControlPanel     |
| `defineProps/Emits`  | Typsichere Komponenten-Kommunikation  |
| `onMounted`          | Canvas-Init, Event-Listener           |
| `onBeforeUnmount`    | Cleanup (RAF, Timer, Events)          |
| `<Transition>`       | Zitat-Fade-Effekt                     |
| Composables          | `useParticles`, `useClock`            |
