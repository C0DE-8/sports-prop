import { useEffect, useState } from 'react'
import { FaCircleInfo, FaDatabase, FaShieldHalved } from 'react-icons/fa6'
import { getDebugInfo, getHealth } from '../../api/statusApi'
import Toast from '../../components/toast/Toast'

function StatusPage() {
  const [debug, setDebug] = useState(null)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadStatus() {
      setError('')

      const [debugResult, healthResult] = await Promise.allSettled([getDebugInfo(), getHealth()])
      if (!active) return

      if (debugResult.status === 'fulfilled') setDebug(debugResult.value)
      if (debugResult.status === 'rejected') setError(debugResult.reason.message)

      if (healthResult.status === 'fulfilled') setHealth(healthResult.value)
      if (healthResult.status === 'rejected') setHealth({ ok: false, error: healthResult.reason.message })
    }

    loadStatus()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Backend</p>
          <h1>Gateway status</h1>
        </div>
      </header>

      <Toast message={error} title="Status request failed" onClose={() => setError('')} />

      <div className="status-grid">
        <StatusBlock icon={FaDatabase} label="DBMS URL" value={debug?.dbms?.dbmsUrl || 'Not loaded'} />
        <StatusBlock icon={FaCircleInfo} label="Site ID" value={debug?.dbms?.siteId || 'Missing'} />
        <StatusBlock icon={FaShieldHalved} label="Full API key" value={debug?.dbms?.hasFullApiKey ? 'Present' : 'Missing'} />
      </div>

      <section className="panel">
        <h2>Health response</h2>
        <pre>{JSON.stringify(health || { ok: false, error: 'Not loaded' }, null, 2)}</pre>
      </section>
    </section>
  )
}

function StatusBlock({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default StatusPage
