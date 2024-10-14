<template>
  <div>
    <!-- If the user is logged in, show personalized home page -->
    <!--b-container fluid v-if="isAuthenticated"-->
    <!-- If the user is not logged in, show generic home page -->
    <!--b-container fluid v-else-->
    <b-container fluid>
        <h1 class="display-5 fw-bold">Meal Mate</h1>
        <p class="fs-4">Welcome to Meal Mate, your personalized meal planning assistant!</p>
    </b-container>
    <Searchbox />
  </div>
</template>

<script>
// Import your auth utility to check if the user is logged in
// import auth from '../auth';
import Searchbox from '../components/searchbox.vue'
// const axios = require('axios')

export default {
  name: 'home',
  methods: {
    login() {
      // Placeholder for login functionality
    }
    /*
    goToMealPlanner() {
      this.$router.push('/meal-planner'); // Navigate to meal planner
    }
    async fetchRecipes() {
      try {
        const response = await axios.get('http://localhost:3000/api/recipes', {
          params: {
            search: this.searchQuery, // Pass search query from Searchbox
            category: this.selectedCategory // Pass selected category
          }
        })
        this.recipes = response.data
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    },
    saveRecipe(recipeId) {
      alert(`Saving recipe ${recipeId} (Save functionality not implemented)`)
    }
    */
  },
  /*
  created() {
    // Check if the user is logged in when the component is created
    this.isAuthenticated = auth.isLoggedIn();
  },
  */
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
      // isAuthenticated: false,
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
