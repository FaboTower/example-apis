// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'

const user = ref(null)
const isReady = ref(false)
const errorMsg = ref('')

onAuthStateChanged(auth, (u) => {
  user.value = u
  isReady.value = true
})

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  async function register(email, password, { requireVerification = false } = {}) {
    errorMsg.value = ''
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      user.value = cred.user

      // (Opcional) exigir verificación de correo
      if (requireVerification) {
        await sendEmailVerification(cred.user)
        // Si quieres exigir verificación antes de usar la app:
        // await signOut(auth); user.value = null;
        // throw new Error('Te enviamos un correo de verificación. Revisa tu bandeja.')
      }
      return cred.user
    } catch (e) {
      errorMsg.value = mapAuthError(e)
      throw e
    }
  }

  async function login(email, password) {
    errorMsg.value = ''
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      user.value = cred.user
    } catch (e) {
      errorMsg.value = mapAuthError(e)
      throw e
    }
  }

  async function logout() {
    await signOut(auth)
    user.value = null
  }

  function waitForAuthInit() {
    return new Promise((resolve) => {
      if (isReady.value) return resolve(user.value)
      const stop = onAuthStateChanged(auth, (u) => {
        user.value = u
        isReady.value = true
        stop()
        resolve(u)
      })
    })
  }

  // Traducción simple de errores comunes
  function mapAuthError(err) {
    const code = err?.code || ''
    const map = {
      'auth/email-already-in-use': 'Ese correo ya está en uso.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres).',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    }
    return map[code] || 'Ocurrió un error de autenticación.'
  }

  return {
    user, isReady, isAuthenticated, errorMsg,
    register, login, logout, waitForAuthInit
  }
}