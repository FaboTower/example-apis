import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
})

export async function getPokemon(identifier) {
  // identifier: 'pikachu' | 25 | 'charizard' ...
  const { data } = await api.get(`/pokemon/${String(identifier).toLowerCase()}`)
  return data
}