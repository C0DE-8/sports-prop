import api from './client'

const storageKey = 'sports_prop_auth'

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload)
  saveAuth(response.data)
  return response.data
}

export async function loginUser(payload) {
  const response = await api.post('/auth/login', payload)
  saveAuth(response.data)
  return response.data
}

export async function getCurrentUser() {
  const response = await api.get('/users/me')
  return response.data
}

export function saveAuth(auth) {
  if (!auth?.token) return
  localStorage.setItem(storageKey, JSON.stringify(auth))
}

export function getSavedAuth() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null')
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(storageKey)
}

api.interceptors.request.use((config) => {
  const auth = getSavedAuth()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})
