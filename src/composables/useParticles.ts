import { ref, watch, type Ref } from 'vue'
import type { Palette, MousePosition } from '../types'

// ── Partikel-Klasse ─────────────────────────────────────────
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  op: number

  constructor(w: number, h: number, speed: number) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    const angle = Math.random() * Math.PI * 2
    const s = speed * (0.5 + Math.random() * 0.5)
    this.vx = Math.cos(angle) * s
    this.vy = Math.sin(angle) * s
    this.r = Math.random() * 1.8 + 0.8
    this.op = Math.random() * 0.5 + 0.25
  }

  update(w: number, h: number, mouse: MousePosition, speed: number): void {
    const dx = this.x - mouse.x
    const dy = this.y - mouse.y
    const distSq = dx * dx + dy * dy

    // Maus-Abstoßung
    if (distSq < 8000 && distSq > 0) {
      const d = Math.sqrt(distSq)
      const force = (90 / d) * 0.8
      this.vx += (dx / d) * force * 0.04
      this.vy += (dy / d) * force * 0.04
    }

    // Geschwindigkeit begrenzen
    const maxV = speed * 2
    const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (v > maxV) {
      this.vx = (this.vx / v) * maxV
      this.vy = (this.vy / v) * maxV
    }

    this.x += this.vx
    this.y += this.vy

    // Wandabprall
    if (this.x < 0)  { this.x = 0; this.vx *= -1 }
    if (this.x > w)  { this.x = w; this.vx *= -1 }
    if (this.y < 0)  { this.y = 0; this.vy *= -1 }
    if (this.y > h)  { this.y = h; this.vy *= -1 }
  }
}

// ── Composable ───────────────────────────────────────────────
export function useParticles(
  canvasRef: Ref<HTMLCanvasElement | null>,
  particleCount: Ref<number>,
  speed: Ref<number>,
  connectionDist: Ref<number>,
  selectedPalette: Ref<number>,
  palettes: Palette[],
  mouse: MousePosition,
) {
  const fps = ref(0)
  const totalConnections = ref(0)

  let particles: Particle[] = []
  let animId = 0
  let lastTime = 0
  let ctx: CanvasRenderingContext2D | null = null

  function initParticles(): void {
    const canvas = canvasRef.value
    if (!canvas) return
    particles = Array.from(
      { length: particleCount.value },
      () => new Particle(canvas.width, canvas.height, speed.value),
    )
  }

  function draw(ts: number): void {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return

    const dt = ts - lastTime
    // Throttle auf ~60 FPS
    if (dt < 14) { animId = requestAnimationFrame(draw); return }
    fps.value = Math.round(1000 / dt)
    lastTime = ts

    const { width: W, height: H } = canvas
    const pal = palettes[selectedPalette.value]
    const dist = connectionDist.value

    ctx.clearRect(0, 0, W, H)

    // Partikel updaten
    for (const p of particles) p.update(W, H, mouse, speed.value)

    // Verbindungslinien zeichnen
    let conns = 0
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d2 = dx * dx + dy * dy
        if (d2 < dist * dist) {
          const alpha = (1 - Math.sqrt(d2) / dist) * 0.55
          ctx.beginPath()
          ctx.strokeStyle = pal.dim + alpha + ')'
          ctx.lineWidth = 0.6
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
          conns++
        }
      }
    }
    totalConnections.value = conns

    // Partikel zeichnen (Halo + Kern)
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = pal.dim + p.op * 0.25 + ')'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = pal.dim + p.op + ')'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = pal.primary
      ctx.fill()
    }

    animId = requestAnimationFrame(draw)
  }

  function resize(): void {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    initParticles()
  }

  function start(): void {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)
  }

  function stop(): void {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }

  // Partikelzahl reagiert auf Änderungen
  watch(particleCount, initParticles)

  // Geschwindigkeit anpassen ohne Neuinitialisierung
  watch(speed, (newSpeed) => {
    for (const p of particles) {
      const angle = Math.atan2(p.vy, p.vx)
      const s = newSpeed * (0.5 + Math.random() * 0.5)
      p.vx = Math.cos(angle) * s
      p.vy = Math.sin(angle) * s
    }
  })

  return { fps, totalConnections, start, stop }
}
