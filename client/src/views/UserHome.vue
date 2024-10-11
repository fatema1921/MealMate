<template>
  <div>
    <b-container fluid>
      <h1 class="display-5 fw-bold">Meal Mate</h1>
      <h1 class="display-5 fw-bold">Welcome Back!</h1>
      <p class="fs-4">Check out your personalized meal plans and favorite recipes.</p>
      <b-button variant="primary" @click="goToMealPlanner">Go to Meal Planner</b-button>
    </b-container>

    <!-- Search Box Component -->
    <Searchbox v-model="searchQuery" />

    <!-- Meal Category Filter -->
    <b-container fluid class="mt-4">
      <b-row>
        <b-col md="4" class="ml-auto">
          <b-form-select v-model="selectedCategory" :options="mealCategories"></b-form-select>
        </b-col>
        <b-col md="4" class="mr-auto">
          <b-button variant="primary" @click="fetchRecipes">Search</b-button>
        </b-col>
      </b-row>
    </b-container>

    <!-- Recipe Results -->
    <b-container fluid class="mt-4" v-if="recipes.length">
      <h3>Search Results:</h3>
      <b-row>
        <b-col v-for="recipe in recipes" :key="recipe._id" md="4" class="mb-3">
          <b-card :title="recipe.name" class="text-center">
            <b-card-text>{{ recipe.description }}</b-card-text>
            <b-button variant="primary" @click="saveRecipe(recipe._id)">Save Recipe</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// Import the Searchbox component and API handling logic
import Searchbox from '../components/Searchbox.vue'
import axios from 'axios'

export default {
  name: 'home',
  components: {
    Searchbox
  },
  data() {
    return {
      searchQuery: '', // Bind this to Searchbox v-model
      selectedCategory: '',
      mealCategories: [
        { value: '', text: 'All' },
        { value: 'Vegan', text: 'Vegan' },
        { value: 'Vegetarian', text: 'Vegetarian' },
        { value: 'Gluten-free', text: 'Gluten-free' },
        { value: 'High-proteine', text: 'High-protein' },
      ],
      recipes: []
    }
  },
  methods: {
    login() {
      // Handle login functionality
      alert('Login button clicked!')
    },
    goToMealPlanner() {
      this.$router.push('/meal-planner') // Navigate to meal planner
    },
    async fetchRecipes() {
      try {
        const response = await axios.get('http://localhost:3000/api/recipes', {
          params: {
            search: this.searchQuery, // User search input
            category: this.selectedCategory // Selected category from dropdown
          }
        })
        this.recipes = response.data // Store the fetched recipes in your Vue component state
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    },
    saveRecipe(recipeId) {
      alert(`Saving recipe ${recipeId} (Save functionality not implemented)`)
    }
  }
}
</script>

<style scoped>
b-container {
  text-align: center;
  margin-top: 100px;
}

/* Background and Button Colors */
body {
  background-color: var(--background-color);
  color: #2C3E50;
}

.btn_message, .btn-primary {
  background-color: var(--button-color);
  border-color: var(--button-color);
}

.btn_message:hover, .btn-primary:hover {
  background-color: var(--button-hover-color);
  border-color: var(--button-hover-color);
}
</style>
