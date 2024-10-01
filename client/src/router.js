import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import myRecipes from './views/myRecipes.vue'
import shoppingList from './views/shoppingList.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/myRecipes', name: 'myRecipes', component: myRecipes },
  { path: '/shoppingList', name: 'shoppingList', component: shoppingList }// det är här du lägger till dem andra sidorna! 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
