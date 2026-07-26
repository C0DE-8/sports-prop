import api from './client'

export async function getMatches(params = {}) {
  const response = await api.get('/matches', { params })
  return response.data
}

export async function getRoundMatches(roundId, params = {}) {
  const response = await api.get(`/matches/round/${roundId}`, { params })
  return response.data
}
