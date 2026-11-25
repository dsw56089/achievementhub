import './progres.css';

export default function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div
      className="pg-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="pg-bar__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
