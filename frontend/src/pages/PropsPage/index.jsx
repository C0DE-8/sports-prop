import { useEffect, useState } from 'react'
import { FaMagnifyingGlass, FaRotateRight } from 'react-icons/fa6'
import { getProps } from '../../api/propsApi'
import Toast from '../../components/toast/Toast'

function PropsPage() {
  const [filters, setFilters] = useState({ league: '', market: '', player: '' })
  const [props, setProps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadProps(nextFilters = filters) {
    setLoading(true)
    setError('')

    try {
      const data = await getProps({ ...nextFilters, limit: 50 })
      setProps(data)
    } catch (loadError) {
      setError(loadError.message)
      setProps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProps()
  }, [])

  function updateFilter(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function submitFilters(event) {
    event.preventDefault()
    loadProps(filters)
  }

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Props</p>
          <h1>Market board</h1>
        </div>
        <button className="icon-button" type="button" onClick={() => loadProps()} aria-label="Refresh props">
          <FaRotateRight />
        </button>
      </header>

      <form className="filter-bar" onSubmit={submitFilters}>
        <label>
          <span>League</span>
          <input name="league" value={filters.league} onChange={updateFilter} placeholder="NBA" />
        </label>
        <label>
          <span>Market</span>
          <input name="market" value={filters.market} onChange={updateFilter} placeholder="points" />
        </label>
        <label>
          <span>Player</span>
          <input name="player" value={filters.player} onChange={updateFilter} placeholder="player name" />
        </label>
        <button type="submit">
          <FaMagnifyingGlass />
          Search
        </button>
      </form>

      <Toast message={error} title="Props request failed" onClose={() => setError('')} />

      <section className="panel">
        {loading ? <p className="muted">Loading props...</p> : <PropCards props={props} />}
      </section>
    </section>
  )
}

function PropCards({ props }) {
  if (!props.length) return <p className="muted">No props matched the current filters.</p>

  return (
    <div className="prop-grid">
      {props.map((prop) => (
        <article className="prop-card" key={prop.id}>
          <div>
            <span>{prop.league || prop.sport || 'League'}</span>
            <strong>{prop.player_name || prop.player || 'Unknown player'}</strong>
          </div>
          <dl>
            <div>
              <dt>Market</dt>
              <dd>{prop.market || '-'}</dd>
            </div>
            <div>
              <dt>Line</dt>
              <dd>{prop.line ?? prop.value ?? '-'}</dd>
            </div>
            <div>
              <dt>Game</dt>
              <dd>{prop.game_id || '-'}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

export default PropsPage
