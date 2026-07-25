import api from './client'

export async function getMatches(params = {}) {
  const response = await api.get('/matches', { params })
  return response.data
}
