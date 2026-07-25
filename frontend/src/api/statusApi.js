import api from './client'

export async function getHealth() {
  const response = await api.get('/health')
  return response.data
}

export async function getDebugInfo() {
  const response = await api.get('/debug')
  return response.data
}
