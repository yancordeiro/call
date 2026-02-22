import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { useAuthStore } from './stores/auth'
import PhosphorIconsVue from '@phosphor-icons/vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(PhosphorIconsVue)

// Initialize auth store and wait for it to complete before mounting
;(async () => {
  const authStore = useAuthStore()
  await authStore.initialize()
  app.mount('#app')
})()
