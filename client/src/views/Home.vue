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

      <!-- Show message if errorMessage is set -->
      <b-container fluid class="mt-4" v-if="errorMessage">
        <p class="text-danger text-center">{{ errorMessage }}</p>
      </b-container>

      <!-- Recipe Results -->
      <b-container fluid class="mt-4" v-if="recipes.length && !errorMessage">
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

        <!-- Display Recipes in Selected View -->
        <div v-if="viewMode === 'grid'">
          <b-row>
            <b-col v-for="recipe in recipes" :key="recipe._id" md="4" class="mb-3">
              <b-card
                :title="recipe.name"
                class="text-center"
                @click="showRecipeDetails(recipe)"
              >
              </b-card>
            </b-col>
          </b-row>
        </div>
        <div v-else-if="viewMode === 'list'">
          <b-list-group>
            <b-list-group-item
              v-for="recipe in recipes"
              :key="recipe._id"
              class="d-flex justify-content-between align-items-center"
              @click="showRecipeDetails(recipe)"
            >
              <h5 class="mb-0">{{ recipe.name }}</h5>
            </b-list-group-item>
          </b-list-group>
        </div>

        <!-- Recipe Details Modal -->
        <b-modal
          v-model="showModal"
          title="Recipe Details"
          hide-footer
          @hide="closeModal"
          size="lg"
        >
          <div v-if="selectedRecipe">
            <h4>{{ selectedRecipe.name }}</h4>

            <!-- Note for User -->
            <p class="text-muted mb-3">
              Note: Checking the box next to each ingredient adds it to your shopping list.
            </p>

            <!-- Ingredients Section -->
            <h5>Ingredients</h5>
            <div class="ingredients-list">
              <b-row
                v-for="(ingredient, index) in selectedRecipe.ingredients"
                :key="ingredient._id"
                class="align-items-center mb-2"
              >
                <b-col cols="1">
                  <b-form-checkbox
                    v-model="ingredient.shoppingList"
                    @change="updateShoppingList(ingredient)"
                    :class="{ 'checked': ingredient.shoppingList }"
                  ></b-form-checkbox>
                </b-col>
                <b-col>
                  {{ ingredient.name }} - {{ ingredient.calories }} kcal
                </b-col>
              </b-row>
            </div>

            <!-- Description Section -->
            <h5 class="mt-4">Description</h5>
            <p>{{ selectedRecipe.description }}</p>
            <b-button variant="primary" @click="saveRecipe(selectedRecipe._id)">
              Save Recipe
            </b-button>
          </div>
        </b-modal>
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
    saveRecipe(recipeId) {

    },
    goToMealPlanner() {
      this.$router.push('/meal-planner') // Navigate to meal planner
    },
    async fetchRecipes() {
      try {
        this.errorMessage = ''
        const response = await axios.get('http://localhost:3000/api/recipes', {
          params: {
            search: this.searchQuery,
            category: this.selectedCategory
          }
        })
        if (response.data && response.data.length) {
          this.recipes = response.data
        } else {
          // If no recipes were found, set the error message
          console.log('No recipes found')
          this.errorMessage = 'No recipes found for this search. Try other keywords or categories.'
          this.recipes = []
          console.log('Error message set to:', this.errorMessage)
        }
      } catch (error) {
        console.log('Error occurred:', error.response)
        // If an error occurs, display a friendly error message
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'No recipes found for this search. Try other keywords or categories.'
        } else {
          this.errorMessage = 'An error occurred while fetching recipes. Please try again later.'
        }
        this.recipes = []
        console.log('Error message set to:', this.errorMessage)
      }
    },
    showRecipeDetails(recipe) {
      // Initialize ingredients' shoppingList field to false if not defined
      recipe.ingredients = recipe.ingredients.map(ingredient => ({
        ...ingredient,
        shoppingList: ingredient.shoppingList || false
      }))
      this.selectedRecipe = recipe
      this.showModal = true
    },
    closeModal() {
      this.selectedRecipe = null
    },
    async updateShoppingList(ingredient) {
      try {
        console.log(`Updating shoppingList for ${ingredient.name}. New value: ${ingredient.shoppingList}`)

        // Make the PATCH request to update the shoppingList status for the specific ingredient
        const response = await axios.patch(`http://localhost:3000/api/ingredients/${ingredient._id}`, {
          shopping_list: ingredient.shoppingList
        })

        console.log(`Successfully updated shoppingList for ${ingredient.name} to: ${ingredient.shoppingList}`)

        console.log(`${ingredient.name} shopping list status updated to: ${ingredient.shoppingList}`)
        console.log('Response from server:', response.data)
      } catch (error) {
        console.error('Error updating shopping list status:', error.response ? error.response.data : error.message)
      }
    }
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
      showModal: false,
      selectedRecipe: null,
      viewMode: 'grid',
      errorMessage: ''
    }
  },
  components: {
    Searchbox
  }
}
</script>

<style scoped>

.ingredients-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.checked .custom-control-input:checked {
  background-color: green !important;
  border-color: green !important;
}

.checked b-form-checkbox {
  background-color: green;
}

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
