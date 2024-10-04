import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Recipes from './views/myRecipes.vue'
import ShoppingList from './views/shoppingList.vue'
import MealPlanner from './views/MealPlanner.vue'
import Profile from './views/MyProfile.vue'
import Login from './views/Login.vue'
import About from './views/About.vue'


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/recipes', name: 'recipes', component: Recipes },
  { path: '/shopping-list', name: 'shopping-list', component: ShoppingList },
  { path: '/meal-planner', name: 'meal-planner', component: MealPlanner },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/login', name: 'login', component: Login },
  { path: '/about', name: 'about', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
