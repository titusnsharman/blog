import type { Person } from './types'
import { today } from './game'

const KEY = 'skini.people.v1'

function seedEntries(startWeight: number, drift: number, wobble: number) {
  const entries = []
  const now = Date.now()
  let w = startWeight
  for (let i = 29; i >= 0; i--) {
    w += drift + (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * wobble
    entries.push({
      date: new Date(now - i * 86_400_000).toISOString().slice(0, 10),
      weightKg: Math.round(w * 10) / 10,
    })
  }
  return entries
}

function seed(): Person[] {
  return [
    {
      id: 'you',
      name: 'You',
      emoji: '🫵',
      heightCm: 178,
      mode: 'maintain',
      entries: seedEntries(72, 0.02, 0.15),
    },
    {
      id: 'maya',
      name: 'Maya',
      emoji: '🦊',
      heightCm: 165,
      mode: 'lose',
      entries: seedEntries(74, -0.12, 0.1),
    },
    {
      id: 'jonas',
      name: 'Jonas',
      emoji: '🐻',
      heightCm: 184,
      mode: 'lose',
      entries: seedEntries(96, -0.08, 0.2),
    },
    {
      id: 'priya',
      name: 'Priya',
      emoji: '🐦',
      heightCm: 160,
      mode: 'maintain',
      entries: seedEntries(55, 0.01, 0.12),
    },
  ]
}

export function loadPeople(): Person[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Person[]
  } catch {
    // fall through to seed
  }
  const people = seed()
  savePeople(people)
  return people
}

export function savePeople(people: Person[]) {
  localStorage.setItem(KEY, JSON.stringify(people))
}

export function addWeighIn(people: Person[], id: string, weightKg: number): Person[] {
  const date = today()
  return people.map((p) => {
    if (p.id !== id) return p
    const entries = p.entries.filter((e) => e.date !== date)
    entries.push({ date, weightKg })
    entries.sort((a, b) => a.date.localeCompare(b.date))
    return { ...p, entries }
  })
}
