import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartSimple, FaShieldHalved, FaWallet } from 'react-icons/fa6'

function LandingPage() {
  return (
    <section className="landing">
      <div className="landing-copy">
        <p className="eyebrow">Sports prop firm platform</p>
        <h1>Run prop challenges with live markets, bankroll rules, and funded-account workflows.</h1>
        <p>
          Prop Desk connects your challenge accounts, real match fixtures, prop boards, risk checks, and
          settlement flow in one operator dashboard.
        </p>
        <div className="landing-actions">
          <Link className="primary-link" to="/register">
            Start account
            <FaArrowRight />
          </Link>
          <Link className="secondary-link" to="/login">
            Login
          </Link>
        </div>
      </div>

      <div className="landing-panel">
        <Feature icon={FaWallet} title="Challenge bankroll" text="Track virtual balance, equity, and pass/fail status." />
        <Feature icon={FaChartSimple} title="Live prop board" text="List markets, locked odds, stakes, and potential payout." />
        <Feature icon={FaShieldHalved} title="Risk engine ready" text="Built for daily loss, drawdown, and validation rules." />
      </div>
    </section>
  )
}

function Feature({ icon: Icon, title, text }) {
  return (
    <article className="feature-row">
      <span>
        <Icon />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </article>
  )
}

export default LandingPage
