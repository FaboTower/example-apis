// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

// const Login    = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
// const Home     = () => import('@/views/Home.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login',    name: 'login',    component: Login,    meta: { public: true } },
    { path: '/register', name: 'register', component: Register, meta: { public: true } },
    { path: '/home/',     name: 'home',     component: Home, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach(async (to) => {
  const { waitForAuthInit, user } = useAuth()
  await waitForAuthInit()
  const isPublic = !!to.meta.public

  if (!user.value && !isPublic) return { name: 'login', query: { redirect: to.fullPath } }
  if (user.value && (to.name === 'login' || to.name === 'register')) return { name: 'home' }
  return true
})

export default router