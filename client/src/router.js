import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Recepes from './views/myRecipes.vue'

const routes = [
  { path: '/', name: 'home', component: Home } // det är här du lägger till dem andra sidorna! 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
