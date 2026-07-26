import { useEffect, useMemo, useState } from 'react'
import { FaBolt, FaCalendarDays, FaChartLine, FaRotateRight } from 'react-icons/fa6'
import { getMatches } from '../../api/matchesApi'
import Toast from '../../components/toast/Toast'

function MatchesPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const [mode, setMode] = useState('round')
  const [roundId, setRoundId] = useState('372154')
  const [matches, setMatches] = useState([])
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMatches(options = {}) {
    const nextMode = options.mode || mode
    setLoading(true)
    setError('')

    try {
      const payload = await getMatches(
        nextMode === 'round'
          ? { mode: 'round', roundId, filters: 'markets:1;bookmakers:2' }
          : { mode: 'date', date },
      )
      const normalized = normalizeMatches(payload)
      setRound(normalized.round)
      setMatches(normalized.matches)
    } catch (loadError) {
      setError(loadError.message)
      setRound(null)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches({ mode: 'round' })
  }, [])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Sportmonks odds feed</p>
          <h1>Round fixtures and markets</h1>
        </div>
        <button className="icon-button" type="button" onClick={() => loadMatches()} aria-label="Refresh matches">
          <FaRotateRight />
        </button>
      </header>

      <div className="filter-bar match-filter">
        <label>
          <span>Mode</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="round">Round odds</option>
            <option value="date">Date fixtures</option>
          </select>
        </label>
        {mode === 'round' ? (
          <label>
            <span>Round ID</span>
            <input value={roundId} inputMode="numeric" onChange={(event) => setRoundId(event.target.value)} />
          </label>
        ) : null}
        <label>
          <span>Date</span>
          <input value={date} type="date" disabled={mode === 'round'} onChange={(event) => setDate(event.target.value)} />
        </label>
        <button type="button" onClick={() => loadMatches()}>
          <FaCalendarDays />
          Load feed
        </button>
      </div>

      <Toast message={error} title="Matches request failed" onClose={() => setError('')} />

      {round ? (
        <section className="round-hero">
          <span>
            <FaBolt />
          </span>
          <div>
            <p className="eyebrow">{round.league?.country?.name || 'Round feed'}</p>
            <h2>{round.name || `Round ${round.id}`}</h2>
            <p>{round.league?.name || 'Fixtures with market and bookmaker filters.'}</p>
          </div>
          <div className="round-stat">
            <strong>{matches.length}</strong>
            <span>fixtures</span>
          </div>
        </section>
      ) : null}

      <section className="panel">
        {loading ? <p className="muted">Loading real match listings...</p> : <MatchCards matches={matches} />}
      </section>
    </section>
  )
}

function MatchCards({ matches }) {
  if (!matches.length) return <p className="muted">No matches returned. Add a Sportmonks API token on the backend.</p>

  return (
    <div className="match-grid">
      {matches.map((match) => (
        <article className="match-card" key={match.id}>
          <div className="match-card-top">
            <span>{match.league?.name || 'Fixture'}</span>
            <strong>{match.name || formatParticipants(match.participants)}</strong>
          </div>
          <div className="team-row">{renderTeams(match.participants)}</div>
          <dl className="match-meta">
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
              <dd>{getOdds(match).length || (match.has_odds ? 'Available' : 'No')}</dd>
            </div>
          </dl>
          <OddsStrip odds={getOdds(match)} />
        </article>
      ))}
    </div>
  )
}

function OddsStrip({ odds }) {
  const visibleOdds = odds.slice(0, 3)
  if (!visibleOdds.length) {
    return (
      <div className="odds-strip empty">
        <FaChartLine />
        <span>No filtered odds returned</span>
      </div>
    )
  }

  return (
    <div className="odds-strip">
      {visibleOdds.map((odd) => (
        <span key={odd.id || `${odd.label}-${odd.value}`}>
          <small>{odd.label}</small>
          <strong>{odd.value}</strong>
        </span>
      ))}
    </div>
  )
}

function normalizeMatches(payload) {
  if (Array.isArray(payload.data)) {
    return { round: null, matches: payload.data }
  }

  return {
    round: payload.data || null,
    matches: payload.data?.fixtures || [],
  }
}

function formatParticipants(participants = []) {
  if (!Array.isArray(participants) || !participants.length) return 'Match'
  return participants.map((participant) => participant.name).filter(Boolean).join(' vs ') || 'Match'
}

function renderTeams(participants = []) {
  if (!Array.isArray(participants) || !participants.length) return <span>Teams pending</span>

  return participants.slice(0, 2).map((participant) => (
    <span key={participant.id || participant.name}>{participant.name}</span>
  ))
}

function getOdds(match) {
  const odds = Array.isArray(match.odds) ? match.odds : []
  return odds.map((odd) => ({
    id: odd.id,
    label: odd.market?.name || odd.label || odd.name || 'Market',
    value: odd.value || odd.label || odd.decimal || odd.odds || '-',
  }))
}

export default MatchesPage
