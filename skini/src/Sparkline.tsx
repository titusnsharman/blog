import { HEALTHY_MIN, HEALTHY_MAX, inRange } from './game'

interface Props {
  values: number[] // BMI series
  width?: number
  height?: number
}

export default function Sparkline({ values, width = 260, height = 56 }: Props) {
  if (values.length < 2) {
    return <div className="sparkline-empty">not enough weigh-ins yet</div>
  }

  const pad = 4
  const min = Math.min(...values, HEALTHY_MIN) - 0.5
  const max = Math.max(...values, HEALTHY_MAX) + 0.5
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2)
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2)

  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const last = values[values.length - 1]
  const color = inRange(last) ? 'var(--good)' : 'var(--bad)'

  return (
    <svg width={width} height={height} className="sparkline" role="img" aria-label="BMI trend">
      <rect
        x={0}
        y={y(HEALTHY_MAX)}
        width={width}
        height={Math.max(0, y(HEALTHY_MIN) - y(HEALTHY_MAX))}
        className="healthy-band"
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(last)} r="3" fill={color} />
    </svg>
  )
}
