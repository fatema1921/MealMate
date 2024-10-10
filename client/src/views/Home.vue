<template>
  <div>
    <div v-if="isAuthenticated">
      <!-- If the user is logged in, show personalized home page -->
      <b-container fluid>
        <h1 class="display-5 fw-bold">Welcome Back!</h1>
        <p class="fs-4">Check out your personalized meal plans and favorite recipes.</p>
        <b-button variant="primary" @click="goToMealPlanner">Go to Meal Planner</b-button>
      </b-container>

      <Searchbox v-model="searchQuery" />

      <!-- Meal Category Filter -->
      <b-container fluid class="mt-4">
        <b-row class="d-flex justify-content-center">
          <b-col md="4">
            <b-form-select v-model="selectedCategory" :options="mealCategories"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-center mt-3">
          <b-col md="4">
            <b-button variant="primary" @click="fetchRecipes" block>Search</b-button>
          </b-col>
        </b-row>
      </b-container>

      <!-- Recipe Results -->
      <b-container fluid class="mt-4" v-if="recipes.length">
        <h3>Search Results:</h3>

        <!-- Toggle between Grid and List view -->
        <b-row class="d-flex justify-content-center mb-3">
          <b-col md="4">
            <b-button-group class="view-toggle" block>
              <b-button
                :class="['toggle-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
              >Grid</b-button>
              <b-button
                :class="['toggle-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
              >List</b-button>
            </b-button-group>
          </b-col>
        </b-row>

        <div v-if="viewMode === 'grid'">
          <b-row>
            <b-col v-for="recipe in recipes" :key="recipe._id" md="4" class="mb-3">
              <b-card :title="recipe.name" class="text-center">
                <b-card-text>{{ recipe.description }}</b-card-text>
                <b-button variant="primary" @click="saveRecipe(recipe._id)">Save Recipe</b-button>
              </b-card>
            </b-col>
          </b-row>
        </div>
        <div v-else-if="viewMode === 'list'">
          <b-list-group>
            <b-list-group-item v-for="recipe in recipes" :key="recipe._id" class="d-flex justify-content-between align-items-center">
              <div>
                <h5>{{ recipe.name }}</h5>
                <p>{{ recipe.description }}</p>
              </div>
              <b-button variant="primary" @click="saveRecipe(recipe._id)">Save Recipe</b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-container>
    </div>
    <div v-else>
      <!-- If the user is not logged in, show generic home page -->
      <b-container fluid>
        <h1 class="display-5 fw-bold">Meal Mate</h1>
        <p class="fs-4">Welcome to your personalized meal planning assistant!</p>
        <RouterLink to="/login">
          <b-button variant="primary" @click="login">Login</b-button>
        </RouterLink>
      </b-container>
    </div>
  </div>
</template>


<script>
import Searchbox from '../components/Searchbox.vue'
import axios from 'axios'

export default {
  name: 'home',
  methods: {
    saveRecipe() {
      // Your recipe saving logic
    },
    goToMealPlanner() {
      this.$router.push('/meal-planner') // Navigate to meal planner
    },
    async fetchRecipes() {
      try {
        console.log('Search query before sending:', this.searchQuery)
        console.log('Selected category before sending:', this.selectedCategory)
        const response = await axios.get('http://localhost:3000/api/recipes', {
          params: {
            search: this.searchQuery,
            category: this.selectedCategory
          }
        })
        this.recipes = response.data
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    }
  },
  watch: {
    searchQuery(newQuery) {
      console.log('Search query updated:', newQuery)
    }
  },
  created() {
    this.isAuthenticated = true // Temporary for testing purposes
  },
  components: {
    Searchbox
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      mealCategories: [
        { value: '', text: 'All' },
        { value: 'Vegan', text: 'Vegan' },
        { value: 'Vegetarian', text: 'Vegetarian' },
        { value: 'Gluten-free', text: 'Gluten-free' },
        { value: 'High-protein', text: 'High-protein' }
      ],
      isAuthenticated: true,
      recipes: [],
      viewMode: 'grid' // Default to 'grid' view
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

/* Toggle Button Group */
.view-toggle {
  width: 100%;
}

.toggle-btn {
  background-color: var(--background-color);
  border-color: var(--footer-bg-color);
  width: 100%;
  transition: background-color 0.2s ease;
  color: #161515;
}

.toggle-btn.active {
  background-color: var(--footer-bg-color);
  border-color: var(--footer-bg-color);
  color: #161515;
}

.toggle-btn:hover {
  background-color: var(--button-color);
  border-color: var(--button-color);
  color: #161515;
}
</style>
