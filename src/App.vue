<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Palette } from './types'
import { useParticles } from './composables/useParticles'
import ControlPanel from './components/ControlPanel.vue'
import InfoPanel   from './components/InfoPanel.vue'

// ── Konfiguration ────────────────────────────────────────────
const particleCount    = ref(80)
const speed            = ref(1.2)
const connectionDist   = ref(130)
const selectedPalette  = ref(0)

const palettes: Palette[] = [
  { name: 'Amber',  primary: '#d4a853', secondary: '#f0c878', dim: 'rgba(212,168,83,'  },
  { name: 'Aqua',   primary: '#4ecdc4', secondary: '#7eddd7', dim: 'rgba(78,205,196,'  },
  { name: 'Rose',   primary: '#ff6b8a', secondary: '#ff9ab0', dim: 'rgba(255,107,138,' },
  { name: 'Violet', primary: '#9b87f5', secondary: '#c4b5fd', dim: 'rgba(155,135,245,' },
]

// ── Mausposition ─────────────────────────────────────────────
const mouse = reactive({ x: 0, y: 0 })
const mousePercX = computed(() =>
  Math.min((mouse.x / window.innerWidth)  * 100, 100),
)
const mousePercY = computed(() =>
  Math.min((mouse.y / window.innerHeight) * 100, 100),
)

function onMouseMove(e: MouseEvent): void {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

// ── Canvas & Partikel ────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)

const { fps, totalConnections, start, stop } = useParticles(
  canvasRef,
  particleCount,
  speed,
  connectionDist,
  selectedPalette,
  palettes,
  mouse,
)

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  start()
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  stop()
})
</script>

<template>
  <canvas ref="canvasRef" id="bg" />
  <div class="bg-glow" />

  <main class="layout">
    <!-- Linkes Panel: Steuerung -->
    <ControlPanel
      v-model:particleCount="particleCount"
      v-model:speed="speed"
      v-model:connectionDist="connectionDist"
      :palettes="palettes"
      :selected-palette="selectedPalette"
      :mouse-perc-x="mousePercX"
      :mouse-perc-y="mousePercY"
      :mouse-x="mouse.x"
      :mouse-y="mouse.y"
      @update:selected-palette="selectedPalette = $event"
    />

    <!-- Mitte: Hero -->
    <div class="center">
      <div class="title-eyebrow">Vue 3 · TypeScript · Canvas</div>
      <h1 class="title-main">Mor<em>phic</em></h1>
      <p class="title-sub">
        Bewege die Maus — Partikel weichen aus.<br />
        Steuere das Universum links.
      </p>
      <div class="divider" />
      <div class="stats-row">
        <div class="stat">
          <div class="stat-num">{{ particleCount }}</div>
          <div class="stat-label">Partikel</div>
        </div>
        <div class="stat">
          <div class="stat-num">{{ totalConnections }}</div>
          <div class="stat-label">Verbindungen</div>
        </div>
        <div class="stat">
          <div class="stat-num">{{ fps }}</div>
          <div class="stat-label">FPS</div>
        </div>
      </div>
    </div>

    <!-- Rechtes Panel: Info -->
    <InfoPanel
      :palettes="palettes"
      :selected-palette="selectedPalette"
      :total-connections="totalConnections"
      :particle-count="particleCount"
    />
  </main>

  <footer class="vue-tag">MORPHIC · VUE 3 + TYPESCRIPT · CANVAS 2D</footer>
</template>

<style>
/* ── Reset ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #06060f;
  --glass:        rgba(255,255,255,0.04);
  --glass-border: rgba(255,255,255,0.08);
  --text:         #e8e4dc;
  --muted:        rgba(232,228,220,0.45);
  --accent:       #d4a853;
  --accent2:      #f0c878;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

/* ── Canvas & Glow ───────────────────────────────────────── */
#bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.bg-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 70%);
  z-index: 1;
  pointer-events: none;
}

/* ── Layout ──────────────────────────────────────────────── */
.layout {
  position: relative;
  z-index: 2;
  height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr 260px;
  padding: 32px 28px;
  gap: 0;
}

/* ── Glassmorphism Panel ─────────────────────────────────── */
.panel {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-label {
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--muted);
  text-transform: uppercase;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--glass-border);
}

/* ── Center ──────────────────────────────────────────────── */
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
}

.title-eyebrow {
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.8;
}

.title-main {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(72px, 9vw, 120px);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.02em;
  text-align: center;
}

.title-main em {
  font-style: italic;
  color: var(--accent);
}

.title-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-top: 20px;
  text-align: center;
  line-height: 1.7;
}

.divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--accent), transparent);
  margin: 24px auto 0;
}

.stats-row {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

.stat { text-align: center; }

.stat-num {
  font-size: 22px;
  font-weight: 500;
  color: var(--accent2);
  line-height: 1;
}

.stat-label {
  font-size: 8px;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 4px;
}

/* ── Controls ────────────────────────────────────────────── */
.control-group { display: flex; flex-direction: column; gap: 10px; }

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.control-name {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}

.control-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent2);
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px rgba(212,168,83,0.6);
  cursor: pointer;
}

/* ── Paletten ────────────────────────────────────────────── */
.palettes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.palette-btn {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: transparent;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--muted);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.palette-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

.palette-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(212,168,83,0.08);
}

.palette-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ── Info Panel ──────────────────────────────────────────── */
.info-block { display: flex; flex-direction: column; gap: 6px; }

.info-key {
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.info-val { font-size: 18px; font-weight: 500; }
.info-val.accent { color: var(--accent2); }

.clock { font-size: 36px; font-weight: 300; letter-spacing: 0.05em; line-height: 1; }

.clock-date {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 4px;
}

.quote-block {
  border-left: 1px solid var(--accent);
  padding-left: 14px;
  margin-top: 8px;
}

.quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-style: italic;
  font-weight: 300;
  line-height: 1.6;
}

.quote-author {
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--muted);
  margin-top: 8px;
}

/* ── Mausanzeige ─────────────────────────────────────────── */
.mouse-indicator {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.1em;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.indicator-bar {
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.indicator-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.1s;
}

/* ── Transition ──────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Footer ──────────────────────────────────────────────── */
.vue-tag {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: rgba(232,228,220,0.2);
  z-index: 10;
}
</style>
