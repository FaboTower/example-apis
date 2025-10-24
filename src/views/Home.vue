<!-- src/views/Home.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { getPokemon } from '@/services/pokeApi'

const router = useRouter()
const { user, logout } = useAuth()

const query     = ref('pikachu')  // valor inicial
const pokemon   = ref(null)
const loading   = ref(false)
const errorMsg  = ref('')
let debounceTimer = null  // ⏳ variable para controlar el retardo

// 🔹 Función principal de búsqueda
async function buscar() {
  if (!query.value) return
  loading.value = true
  errorMsg.value = ''
  pokemon.value = null
  try {
    pokemon.value = await getPokemon(query.value)
  } catch (e) {
    errorMsg.value = 'No se encontró el Pokémon. Prueba con otro nombre (ej: eevee, charizard).'
  } finally {
    loading.value = false
  }
}

// 🔹 Debounce manual: espera 500 ms desde el último cambio
function debounceBuscar() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    buscar()
  }, 500)
}

onMounted(() => {
    buscar()

})



watch(query, debounceBuscar)

const foto = computed(() =>
  pokemon.value?.sprites?.other?.['official-artwork']?.front_default
  || pokemon.value?.sprites?.front_default
  || ''
)
const habilidades = computed(() =>
  (pokemon.value?.abilities ?? []).map(a => a.ability.name)
)
const movimientos = computed(() =>
  (pokemon.value?.moves ?? []).map(m => m.move.name)
)

async function salir() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main style="max-width:960px;margin:2rem auto;">
    <header style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
      <div>
        <h1 style="margin:0;">PokéHome</h1>
        <small>Autenticado como <strong>{{ user?.email }}</strong></small>
      </div>
      <button @click="salir">Salir</button>
    </header>

    <section style="display:flex;gap:.5rem;margin-top:1rem;">
      <input
        v-model="query"
        placeholder="Busca por nombre (ej: pikachu, eevee, charizard)"
        style="flex:1"
      />
      <button @click="buscar" :disabled="loading">Buscar</button>
    </section>

    <p v-if="loading" style="margin-top:1rem;">Cargando…</p>
    <p v-else-if="errorMsg" style="margin-top:1rem;color:#c00;">{{ errorMsg }}</p>

    <section
      v-else-if="pokemon"
      style="display:grid;grid-template-columns:280px 1fr;gap:1rem;margin-top:1rem;"
    >
      <div style="text-align:center;">
        <img v-if="foto" :src="foto" :alt="pokemon.name" style="max-width:100%;height:auto;" />
        <p v-else>Sin imagen disponible</p>
        <span>foto</span>
        <h2 style="text-transform:capitalize;margin:.5rem 0 0;">{{ pokemon.name }}</h2>
        <p style="margin:0;">ID: {{ pokemon.id }} | Altura: {{ pokemon.height }} | Peso: {{ pokemon.weight }}</p>
        <p style="margin:0;">Tipos: <strong>{{ (pokemon.types ?? []).map(t=>t.type.name).join(', ') }}</strong></p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div>
          <h3>Habilidades</h3>
          <ul><li v-for="h in habilidades" :key="h">{{ h }}</li></ul>
        </div>

        <div>
          <h3>Movimientos</h3>
          <ul style="max-height:280px;overflow:auto;">
            <li v-for="m in movimientos" :key="m">{{ m }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-else style="margin-top:1rem;">Sin datos…</section>
  </main>
</template>