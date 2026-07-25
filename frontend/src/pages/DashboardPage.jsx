import { useEffect, useMemo, useState } from 'react'
import { FaCircleCheck, FaTriangleExclamation, FaTrophy } from 'react-icons/fa6'
import { getProps } from '../api/propsApi'
import { getDebugInfo, getHealth } from '../api/statusApi'

function DashboardPage() {
  const [props, setProps] = useState([])
  const [debug, setDebug] = useState(null)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [debugResult, propsResult, healthResult] = await Promise.allSettled([
          getDebugInfo(),
          getProps({ limit: 6 }),
          getHealth(),
        ])

        if (!active) return

        if (debugResult.status === 'fulfilled') setDebug(debugResult.value)
        if (propsResult.status === 'fulfilled') setProps(propsResult.value)
        if (healthResult.status === 'fulfilled') setHealth(healthResult.value)
        if (healthResult.status === 'rejected') setHealth({ ok: false, error: healthResult.reason.message })

        const failed = [debugResult, propsResult].find((result) => result.status === 'rejected')
        if (failed) setError(failed.reason.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const sportCount = useMemo(() => {
    return new Set(props.map((prop) => prop.sport).filter(Boolean)).size
  }, [props])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Sports prop backend</p>
          <h1>Prop operations dashboard</h1>
        </div>
        <StatusPill ok={health?.ok} />
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <div className="metric-grid">
        <Metric label="Loaded props" value={loading ? '...' : props.length} />
        <Metric label="Sports active" value={loading ? '...' : sportCount} />
        <Metric label="Props table" value={debug?.tables?.props || 'sports_props'} />
      </div>

      <section className="panel">
        <div className="panel-title">
          <FaTrophy />
          <h2>Latest board</h2>
        </div>
        <PropTable props={props} loading={loading} />
      </section>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusPill({ ok }) {
  const Icon = ok ? FaCircleCheck : FaTriangleExclamation

  return (
    <span className={`status-pill ${ok ? 'good' : 'bad'}`}>
      <Icon />
      {ok ? 'Gateway online' : 'Gateway check'}
    </span>
  )
}

function PropTable({ props, loading }) {
  if (loading) return <p className="muted">Loading board data...</p>
  if (!props.length) return <p className="muted">No props returned from the API.</p>

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Market</th>
            <th>Line</th>
            <th>League</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.id}>
              <td>{prop.player_name || prop.player || 'Unknown'}</td>
              <td>{prop.market || 'Market'}</td>
              <td>{prop.line ?? prop.value ?? '-'}</td>
              <td>{prop.league || prop.sport || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardPage
