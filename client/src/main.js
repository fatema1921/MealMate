import { createApp, reactive } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)
const globalState = reactive({
  isLoggedIn: !!localStorage.getItem('userId')
})
app.provide('globalState', globalState)
app.use(createBootstrap())
app.use(router)
app.mount('#app')
app.use(VCalendar, {})
