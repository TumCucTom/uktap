import { useEffect } from 'react'

interface Step {
  icon: string
  title: string
  text: string
}

const STEPS: Step[] = [
  {
    icon: '🔎',
    title: 'Find Matty',
    text: 'Each round Matty’s hiding in a real UK place. Tap the map where you think he is, then submit your pin.',
  },
  {
    icon: '📏',
    title: 'Closer is better',
    text: 'Your score is the total miles your pins land from Matty across all five rounds — the lower, the better.',
  },
  {
    icon: '⚡',
    title: 'Spend your double',
    text: 'One round counts double. Arm it on a place you’re sure of — if you never use it, it’s forced onto the last round.',
  },
  {
    icon: '🔥',
    title: 'Play every day',
    text: 'Matty hides somewhere new each day — the same puzzle for everyone. Come back daily to keep your streak alive.',
  },
]

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  // Close on Escape, and lock background scroll while the dialog is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="howto-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <div className="modal-head">
          <span className="home-kicker">How to play</span>
          <h2 id="howto-title">Find Matty in five</h2>
        </div>
        <ol className="howto-steps">
          {STEPS.map((s) => (
            <li key={s.title} className="howto-step">
              <span className="howto-icon">{s.icon}</span>
              <div className="howto-copy">
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <button className="primary modal-cta" onClick={onClose}>
          Got it — find Matty
        </button>
      </div>
    </div>
  )
}
