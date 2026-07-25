import api from './client'

export async function getProps(params = {}) {
  const response = await api.get('/api/props', { params })
  return response.data
}

export async function getPropById(id) {
  const response = await api.get(`/api/props/${id}`)
  return response.data
}

export async function getLeagues() {
  const response = await api.get('/api/leagues')
  return response.data
}
