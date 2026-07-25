import { useEffect, useMemo, useState } from 'react'
import { FaCalendarDays, FaRotateRight } from 'react-icons/fa6'
import { getMatches } from '../api/matchesApi'

function MatchesPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMatches(nextDate = date) {
    setLoading(true)
    setError('')

    try {
      const payload = await getMatches({ date: nextDate })
      setMatches(payload.data || [])
    } catch (loadError) {
      setError(loadError.message)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches(today)
  }, [today])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Real fixtures</p>
          <h1>Match listings</h1>
        </div>
        <button className="icon-button" type="button" onClick={() => loadMatches()} aria-label="Refresh matches">
          <FaRotateRight />
        </button>
      </header>

      <div className="filter-bar match-filter">
        <label>
          <span>Date</span>
          <input value={date} type="date" onChange={(event) => setDate(event.target.value)} />
        </label>
        <button type="button" onClick={() => loadMatches(date)}>
          <FaCalendarDays />
          Load matches
        </button>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      <section className="panel">
        {loading ? <p className="muted">Loading real match listings...</p> : <MatchCards matches={matches} />}
      </section>
    </section>
  )
}

function MatchCards({ matches }) {
  if (!matches.length) return <p className="muted">No matches returned. Add a Sportmonks API token on the backend.</p>

  return (
    <div className="prop-grid">
      {matches.map((match) => (
        <article className="prop-card" key={match.id}>
          <div>
            <span>{match.league?.name || 'Fixture'}</span>
            <strong>{match.name || formatParticipants(match.participants)}</strong>
          </div>
          <dl>
            <div>
              <dt>Kickoff</dt>
              <dd>{match.starting_at || '-'}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{match.state?.name || match.state_id || '-'}</dd>
            </div>
            <div>
              <dt>Odds</dt>
              <dd>{match.has_odds ? 'Available' : 'No'}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function formatParticipants(participants = []) {
  if (!Array.isArray(participants) || !participants.length) return 'Match'
  return participants.map((participant) => participant.name).filter(Boolean).join(' vs ') || 'Match'
}

export default MatchesPage
