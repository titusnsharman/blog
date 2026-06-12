export type Mode = 'maintain' | 'lose'

export interface Entry {
  date: string // YYYY-MM-DD
  weightKg: number
}

export interface Person {
  id: string
  name: string
  emoji: string
  heightCm: number
  mode: Mode
  entries: Entry[] // sorted ascending by date
}
