import { Link } from 'react-router-dom'
import { FaArrowLeft, FaTriangleExclamation } from 'react-icons/fa6'

function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="not-found-card">
        <span>
          <FaTriangleExclamation />
        </span>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The route you opened does not exist in Prop Desk.</p>
        <Link className="primary-link" to="/">
          <FaArrowLeft />
          Back home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
