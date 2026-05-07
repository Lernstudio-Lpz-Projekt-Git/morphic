import { ref, onUnmounted } from 'vue'

export function useClock() {
  const clock   = ref('')
  const dateStr = ref('')

  function update(): void {
    const now = new Date()
    clock.value = now.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    dateStr.value = now.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  update()
  const timer = setInterval(update, 1000)
  onUnmounted(() => clearInterval(timer))

  return { clock, dateStr }
}
