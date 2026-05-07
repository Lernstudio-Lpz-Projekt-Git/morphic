<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { Palette, Quote } from '../types'
import { useClock } from '../composables/useClock'

const props = defineProps<{
  palettes: Palette[]
  selectedPalette: number
  totalConnections: number
  particleCount: number
}>()

const { clock, dateStr } = useClock()

const quotes: Quote[] = [
  { text: 'Die Einfachheit ist die höchste Stufe der Vollendung.', author: 'Leonardo da Vinci' },
  { text: 'Alles Große ist einfach, und vieles lässt sich in einem einzigen Wort ausdrücken.', author: 'Winston Churchill' },
  { text: 'Das Schöne ist nichts als der Anfang des Schrecklichen.', author: 'Rainer Maria Rilke' },
  { text: 'In der Beschränkung zeigt sich der Meister.', author: 'Johann Wolfgang von Goethe' },
  { text: 'Jede Form ist das Erstarren einer Bewegung.', author: 'Paul Klee' },
]

const quoteIndex = ref(0)
const currentQuote = computed(() => quotes[quoteIndex.value])

const density = computed<string>(() => {
  const ratio = props.totalConnections / Math.max(props.particleCount, 1)
  if (ratio < 2)  return 'Sparse'
  if (ratio < 5)  return 'Normal'
  if (ratio < 10) return 'Dicht'
  return 'Vernetzt'
})

const timer = setInterval(() => {
  quoteIndex.value = (quoteIndex.value + 1) % quotes.length
}, 8000)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="panel">
    <div class="panel-label">// Info</div>

    <div class="info-block">
      <div class="info-key">Uhrzeit</div>
      <div class="clock">{{ clock }}</div>
      <div class="clock-date">{{ dateStr }}</div>
    </div>

    <div class="info-block">
      <div class="info-key">Aktive Palette</div>
      <div class="info-val accent">{{ palettes[selectedPalette].name }}</div>
    </div>

    <div class="info-block">
      <div class="info-key">Dichte</div>
      <div class="info-val">{{ density }}</div>
    </div>

    <div class="info-block" style="margin-top: auto;">
      <div class="info-key">Zitat</div>
      <Transition name="fade" mode="out-in">
        <div class="quote-block" :key="quoteIndex">
          <div class="quote-text">{{ currentQuote.text }}</div>
          <div class="quote-author">— {{ currentQuote.author }}</div>
        </div>
      </Transition>
    </div>
  </div>
</template>
