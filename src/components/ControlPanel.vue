<script setup lang="ts">
import type { Palette } from '../types'

defineProps<{
  palettes: Palette[]
  selectedPalette: number
  mousePercX: number
  mousePercY: number
  mouseX: number
  mouseY: number
}>()

const particleCount  = defineModel<number>('particleCount',  { required: true })
const speed          = defineModel<number>('speed',          { required: true })
const connectionDist = defineModel<number>('connectionDist', { required: true })

const emit = defineEmits<{ 'update:selectedPalette': [value: number] }>()
</script>

<template>
  <div class="panel">
    <div class="panel-label">// Steuerung</div>

    <!-- Partikelanzahl -->
    <div class="control-group">
      <div class="control-header">
        <span class="control-name">Partikel</span>
        <span class="control-val">{{ particleCount }}</span>
      </div>
      <input type="range" min="20" max="200" step="5" v-model.number="particleCount" />
    </div>

    <!-- Geschwindigkeit -->
    <div class="control-group">
      <div class="control-header">
        <span class="control-name">Geschwindigkeit</span>
        <span class="control-val">{{ speed.toFixed(1) }}</span>
      </div>
      <input type="range" min="0.2" max="4" step="0.1" v-model.number="speed" />
    </div>

    <!-- Verbindungsradius -->
    <div class="control-group">
      <div class="control-header">
        <span class="control-name">Verbindungsradius</span>
        <span class="control-val">{{ connectionDist }}px</span>
      </div>
      <input type="range" min="40" max="250" step="5" v-model.number="connectionDist" />
    </div>

    <!-- Farbpaletten -->
    <div class="control-group">
      <div class="control-header">
        <span class="control-name">Farbpalette</span>
      </div>
      <div class="palettes">
        <button
          v-for="(p, i) in palettes"
          :key="p.name"
          class="palette-btn"
          :class="{ active: selectedPalette === i }"
          @click="emit('update:selectedPalette', i)"
        >
          <span class="palette-dot" :style="{ background: p.primary }" />
          {{ p.name }}
        </button>
      </div>
    </div>

    <!-- Mausposition -->
    <div class="mouse-indicator" style="margin-top: auto;">
      <span>Maus X — {{ Math.round(mouseX) }}px</span>
      <div class="indicator-bar">
        <div class="indicator-fill" :style="{ width: mousePercX + '%' }" />
      </div>
      <span style="margin-top: 4px;">Maus Y — {{ Math.round(mouseY) }}px</span>
      <div class="indicator-bar">
        <div class="indicator-fill" :style="{ width: mousePercY + '%' }" />
      </div>
    </div>
  </div>
</template>
