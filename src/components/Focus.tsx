import { useChromeStorage } from '../hooks/useChromeStorage'
import { randoItem } from '../utils'
import { Button } from './Button'

const quotes = [
  'stop chasing things that\ndo nothing for your growth',
  'slow progress\nbeats no progress',
]

export function Focus() {
  const [focus, setFocus] = useChromeStorage('focus', '')

  return (
    <section id="focus" className="container">
      <p className="label">
        what should we <br /> focus on today?
      </p>
      <textarea
        id="focus"
        placeholder={randoItem(quotes)}
        value={focus}
        onChange={event => {
          setFocus(event.target.value)
        }}
      />
      <Button
        variant="icon"
        showOnHover
        absolutePosition
        onClick={() => setFocus('')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
          <path d="M18 13.3l-6.3 -6.3" />
        </svg>
      </Button>
    </section>
  )
}
