import api from './client'

export async function getProps(params = {}) {
  const response = await api.get('/props', { params })
  return response.data
}

export async function getPropById(id) {
  const response = await api.get(`/props/${id}`)
  return response.data
}

export async function getLeagues() {
  const response = await api.get('/leagues')
  return response.data
}
