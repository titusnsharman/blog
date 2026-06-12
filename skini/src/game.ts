import type { Person } from './types'

export const HEALTHY_MIN = 18.5
export const HEALTHY_MAX = 24.9

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

export function bmiSeries(p: Person): number[] {
  return p.entries.map((e) => bmi(e.weightKg, p.heightCm))
}

export function inRange(b: number): boolean {
  return b >= HEALTHY_MIN && b <= HEALTHY_MAX
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
}

/**
 * Streak in days. Maintain mode: consecutive trailing entries with BMI in the
 * healthy range. Lose mode: consecutive trailing entries where weight went
 * down (or held) versus the previous weigh-in. A gap of more than 2 days
 * between weigh-ins breaks the streak either way.
 */
export function streakDays(p: Person): number {
  const es = p.entries
  if (es.length === 0) return 0

  if (p.mode === 'maintain') {
    let start = es.length
    while (start > 0 && inRange(bmi(es[start - 1].weightKg, p.heightCm))) {
      if (start < es.length && daysBetween(es[start - 1].date, es[start].date) > 2) break
      start--
    }
    if (start === es.length) return 0
    return daysBetween(es[start].date, es[es.length - 1].date) + 1
  }

  // lose mode
  let start = es.length - 1
  while (
    start > 0 &&
    es[start].weightKg <= es[start - 1].weightKg &&
    daysBetween(es[start - 1].date, es[start].date) <= 2
  ) {
    start--
  }
  if (start === es.length - 1) return 0
  return daysBetween(es[start].date, es[es.length - 1].date) + 1
}

/** Total kg lost from the heaviest weigh-in to the latest one (lose mode). */
export function kgLost(p: Person): number {
  if (p.entries.length === 0) return 0
  const peak = Math.max(...p.entries.map((e) => e.weightKg))
  const current = p.entries[p.entries.length - 1].weightKg
  return Math.max(0, peak - current)
}

/**
 * Score: maintain mode earns 10 pts per streak day; lose mode earns 25 pts
 * per kg lost plus 5 pts per streak day to reward consistency.
 */
export function score(p: Person): number {
  if (p.mode === 'maintain') return streakDays(p) * 10
  return Math.round(kgLost(p) * 25 + streakDays(p) * 5)
}

export function currentBmi(p: Person): number | null {
  if (p.entries.length === 0) return null
  return bmi(p.entries[p.entries.length - 1].weightKg, p.heightCm)
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
