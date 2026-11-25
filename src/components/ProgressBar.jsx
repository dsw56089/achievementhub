export default function ProgressBar({ value = 0, accent = '#a78bfa' }) {
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <div className="progress-fill" style={{ width: `${value}%`, background: accent }} />
    </div>
  )
}
