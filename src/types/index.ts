export interface Palette {
  name: string
  primary: string
  secondary: string
  dim: string // e.g. 'rgba(212,168,83,'
}

export interface Quote {
  text: string
  author: string
}

export interface MousePosition {
  x: number
  y: number
}

export interface ParticleConfig {
  count: number
  speed: number
  connectionDist: number
}
