<!-- src/views/Register.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const confirm  = ref('')
const loading  = ref(false)
const localError = ref('')

const router = useRouter()
const route  = useRoute()
const { register, errorMsg } = useAuth()

async function onSubmit() {
  localError.value = ''
  if (password.value !== confirm.value) {
    localError.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  try {
    // Cambia requireVerification a true si quieres forzar verificación por correo
    await register(email.value, password.value, { requireVerification: false })
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch {
    localError.value = errorMsg.value || 'No se pudo crear la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section style="max-width:420px;margin:3rem auto;">
    <h2>Crear cuenta</h2>
    <form @submit.prevent="onSubmit">
      <label>Correo
        <input v-model="email" type="email" required />
      </label>

      <label style="display:block;margin-top:8px;">Contraseña
        <input v-model="password" type="password" minlength="6" required />
      </label>

      <label style="display:block;margin-top:8px;">Confirmar contraseña
        <input v-model="confirm" type="password" minlength="6" required />
      </label>

      <button :disabled="loading" style="margin-top:12px;">
        {{ loading ? 'Creando…' : 'Crear cuenta' }}
      </button>
    </form>

    <p v-if="localError" style="color:#c00;margin-top:.75rem;">{{ localError }}</p>

    <p style="margin-top:1rem;">
      ¿Ya tienes cuenta? <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
    </p>
  </section>
</template>