<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref('')

const route = useRoute()
const router = useRouter()
const { login, errorMsg } = useAuth()

async function onSubmit() {
  localError.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch {
    // muestra el error global si lo setea el composable
    localError.value = errorMsg.value || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section style="max-width:380px;margin:4rem auto;">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="onSubmit">
      <label>Correo
        <input v-model="email" type="email" required />
      </label>
      <label style="display:block;margin-top:8px;">Contraseña
        <input v-model="password" type="password" required />
      </label>
      <button :disabled="loading" style="margin-top:12px;">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
    <p style="margin-top:1rem;">
  ¿No tienes cuenta? <router-link :to="{ name:'register' }">Crear cuenta</router-link>
</p>
    <p v-if="localError" style="color:#c00;margin-top:8px;">{{ localError }}</p>
  </section>
</template>