import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Recipes from './views/MyRecipes.vue'
import ShoppingList from './views/ShoppingList.vue'
import MealPlanner from './views/MealPlanner.vue'
import Profile from './views/MyProfile.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/recipes', name: 'recipes', component: Recipes },
  { path: '/shopping-list', name: 'shopping-list', component: ShoppingList },
  { path: '/meal-planner', name: 'meal-planner', component: MealPlanner },
  { path: '/profile', name: 'profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
