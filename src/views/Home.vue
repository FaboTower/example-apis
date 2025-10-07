<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function salir() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main style="max-width:960px;margin:2rem auto;">
    <header style="display:flex;justify-content:space-between;align-items:center;">
      <h1>Home</h1>
      <button @click="salir">Salir</button>
    </header>

    <p>Bienvenido,
      <strong>{{ user?.email || 'usuario' }}</strong>.
      Esta es una ruta protegida.
    </p>
  </main>
</template>