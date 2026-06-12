import { useMemo, useState } from 'react'
import type { Person } from './types'
import { bmiSeries, currentBmi, inRange, kgLost, score, streakDays } from './game'
import { addWeighIn, loadPeople, savePeople } from './storage'
import Sparkline from './Sparkline'
import './App.css'

function PersonCard({
  person,
  rank,
  onWeighIn,
  onToggleMode,
}: {
  person: Person
  rank: number
  onWeighIn: (id: string, weight: number) => void
  onToggleMode: (id: string) => void
}) {
  const [weight, setWeight] = useState('')
  const b = currentBmi(person)
  const streak = streakDays(person)
  const lost = kgLost(person)
  const isYou = person.id === 'you'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!Number.isFinite(w) || w <= 0) return
    onWeighIn(person.id, w)
    setWeight('')
  }

  return (
    <article className={`card${isYou ? ' card-you' : ''}`}>
      <header className="card-header">
        <span className="rank">{rank === 1 ? '🏆' : `#${rank}`}</span>
        <span className="avatar">{person.emoji}</span>
        <h2>{person.name}</h2>
        <button
          className={`mode mode-${person.mode}`}
          onClick={() => onToggleMode(person.id)}
          title="Toggle between maintain and weight-loss mode"
        >
          {person.mode === 'maintain' ? '🛡 maintain' : '📉 lose'}
        </button>
      </header>

      <Sparkline values={bmiSeries(person)} />

      <div className="stats">
        <div className="stat">
          <span className={`stat-value ${b !== null && inRange(b) ? 'good' : 'bad'}`}>
            {b !== null ? b.toFixed(1) : '—'}
          </span>
          <span className="stat-label">BMI</span>
        </div>
        <div className="stat">
          <span className="stat-value">{streak > 0 ? `🔥 ${streak}` : '0'}</span>
          <span className="stat-label">day streak</span>
        </div>
        {person.mode === 'lose' && (
          <div className="stat">
            <span className="stat-value">{lost.toFixed(1)}</span>
            <span className="stat-label">kg lost</span>
          </div>
        )}
        <div className="stat">
          <span className="stat-value">{score(person)}</span>
          <span className="stat-label">points</span>
        </div>
      </div>

      {isYou && (
        <form className="weigh-in" onSubmit={submit}>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            placeholder="today's weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <button type="submit">log</button>
        </form>
      )}
    </article>
  )
}

export default function App() {
  const [people, setPeople] = useState<Person[]>(loadPeople)

  const update = (next: Person[]) => {
    savePeople(next)
    setPeople(next)
  }

  const ranked = useMemo(
    () => [...people].sort((a, b) => score(b) - score(a)),
    [people],
  )

  const onWeighIn = (id: string, w: number) => update(addWeighIn(people, id, w))
  const onToggleMode = (id: string) =>
    update(
      people.map((p) =>
        p.id === id ? { ...p, mode: p.mode === 'maintain' ? 'lose' : 'maintain' } : p,
      ),
    )

  return (
    <main>
      <header className="app-header">
        <h1>skini</h1>
        <p>BMI sparklines with friends — stay in range, keep the streak 🔥</p>
      </header>
      <section className="cards">
        {ranked.map((p, i) => (
          <PersonCard
            key={p.id}
            person={p}
            rank={i + 1}
            onWeighIn={onWeighIn}
            onToggleMode={onToggleMode}
          />
        ))}
      </section>
      <footer className="app-footer">
        🛡 maintain mode: 10 pts per day your BMI stays in the healthy band ·
        📉 lose mode: 25 pts per kg lost + 5 pts per streak day
      </footer>
    </main>
  )
}
