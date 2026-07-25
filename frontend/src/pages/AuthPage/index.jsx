import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa6'
import { loginUser, registerUser } from '../../api/authApi'
import Toast from '../../components/toast/Toast'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateForm(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function submitForm(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegister) {
        await registerUser(form)
      } else {
        await loginUser({ email: form.email, password: form.password })
      }

      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{isRegister ? 'Create account' : 'Welcome back'}</p>
        <h1>{isRegister ? 'Register for Prop Desk' : 'Login to Prop Desk'}</h1>
        <p className="muted">
          {isRegister
            ? 'Create a user record for challenge access and account tracking.'
            : 'Access your dashboard, prop board, and account status.'}
        </p>

        <form className="auth-form" onSubmit={submitForm}>
          {isRegister ? (
            <label>
              <span>Name</span>
              <div>
                <FaUser />
                <input name="name" value={form.name} onChange={updateForm} placeholder="Your name" required />
              </div>
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <div>
              <FaEnvelope />
              <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="you@example.com" required />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div>
              <FaLock />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateForm}
                placeholder="Minimum 8 characters"
                minLength={isRegister ? 8 : undefined}
                required
              />
            </div>
          </label>

          <Toast message={error} title="Authentication error" onClose={() => setError('')} />

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </div>
    </section>
  )
}

export default AuthPage
