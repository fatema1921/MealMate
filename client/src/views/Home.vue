<template>
  <div>
    <div v-if="isLoggedIn">
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

      <!-- Suggested Recipes for User -->
      <b-container fluid class="mt-4" v-if="suggestedRecipes.length && !recipes.length && !searchQuery && !errorMessage">
        <h3>Suggested recipes for you:</h3>

        <!-- Display Suggested Recipes -->
        <div v-if="viewMode === 'grid'">
          <b-row>
            <b-col v-for="recipe in suggestedRecipes" :key="recipe._id" md="4" class="mb-3">
              <b-card :title="recipe.name" class="text-center" @click="showRecipeDetails(recipe)">
              </b-card>
            </b-col>
          </b-row>
        </div>
        <div v-else-if="viewMode === 'list'">
          <b-list-group>
            <b-list-group-item
              v-for="recipe in suggestedRecipes"
              :key="recipe._id"
              class="d-flex justify-content-between align-items-center"
              @click="showRecipeDetails(recipe)"
            >
              <h5 class="mb-0">{{ recipe.name }}</h5>
            </b-list-group-item>
          </b-list-group>
        </div>
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
                    @change="updateShoppingList(ingredient)"
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
            <!-- Success Alert -->
            <b-alert
              v-model="showSuccessAlert"
              variant="success"
              dismissible
              fade
              class="mt-3"
            >
              {{ successMessage }}
            </b-alert>
            <!-- Already Saved Alert -->
            <b-alert
              v-model="showAlreadySavedAlert"
              variant="warning"
              dismissible
              fade
              class="mt-3"
            >
              {{ alreadySavedMessage }}
            </b-alert>
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
                    @change="updateShoppingList(ingredient)"
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

            <!-- Message and Login Button for Non-Logged-In Users -->
            <b-button variant="primary" @click="showLoginPrompt = true">
              Save Recipe
            </b-button>
          </div>
        </b-modal>

        <!-- Login Prompt Modal -->
        <b-modal v-model="showLoginPrompt" hide-footer backdrop="static" @hide="showLoginPrompt = false">
          <div class="text-center">
            <h4 class="mb-3">You need to log in to save a recipe</h4>
            <RouterLink to="/login">
              <b-button variant="primary">Login</b-button>
            </RouterLink>
            <b-button variant="secondary" @click="showLoginPrompt = false">Close</b-button>
          </div>
        </b-modal>

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
    async saveRecipe(recipeId) {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId')
        if (!userId) {
          console.error('User ID not found in localStorage.')
          return
        }
        // First, get the user's existing saved recipes
        const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const user = userResponse.data

        // Check if the recipe is already saved
        if (user.recipes.includes(recipeId)) {
          console.log('Recipe is already saved.')
          this.alreadySavedMessage = 'This recipe is already saved.'
          this.showAlreadySavedAlert = true
          // Automatically hide the alert after 3 seconds
          setTimeout(() => {
            this.showAlreadySavedAlert = false
          }, 3000)
          return
        }

        // Add the new recipe to the user's list of saved recipes
        const updatedRecipes = [...user.recipes, recipeId]

        // Make a PATCH request to update the user's saved recipes
        const response = await axios.patch(`http://localhost:3000/api/users/${userId}`, {
          recipes: updatedRecipes // Send the updated list of recipes
        })

        this.successMessage = 'Recipe was saved successfully.'
        this.showSuccessAlert = true
        // Hide after 3 seconds
        setTimeout(() => {
          this.showSuccessAlert = false
        }, 3000)
        console.log(`Recipe with ID ${recipeId} saved successfully.`)
        console.log('Updated user data:', response.data)
      } catch (error) {
        console.error('Error saving the recipe:', error.response ? error.response.data : error.message)
      }
    },
    goToMealPlanner() {
      this.$router.push('/meal-planner') // Navigate to meal planner
    },
    async fetchSuggestedRecipes() {
      try {
        const userId = localStorage.getItem('userId')
        // const userId = '66f18ee5dc8b72b161275216'
        if (!userId) {
          console.error('User ID not found in localStorage.')
          return
        }

        // Fetch the user's meal category
        const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const user = userResponse.data
        const userMealCategory = user.meal_category

        if (userMealCategory) {
          // Fetch recipes based on the user's meal category
          const response = await axios.get('http://localhost:3000/api/recipes', {
            params: { category: userMealCategory }
          })

          if (response.data && response.data.length) {
            this.suggestedRecipes = response.data // Store suggested recipes
          } else {
            console.log('No suggested recipes found.')
          }
        }
      } catch (error) {
        console.error('Error fetching suggested recipes:', error.response ? error.response.data : error.message)
      }
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
      // Initialize ingredients' shoppingList field to false when opening the recipe
      recipe.ingredients = recipe.ingredients.map(ingredient => ({
        ...ingredient,
        shoppingList: false // Always set to false initially
      }))

      this.selectedRecipe = recipe
      this.showModal = true
    },
    closeModal() {
      this.selectedRecipe = null
      this.showModal = false
    },
    async updateShoppingList(ingredient) {
      try {
        console.log(`Initital Checkbox status: ${ingredient.shoppingList}`)
        ingredient.shoppingList = !ingredient.shoppingList
        console.log(`New Checkbox status: ${ingredient.shoppingList}`)

        const userId = localStorage.getItem('userId')
        // const userId = '66f18ee5dc8b72b161275216'

        // Fetch the current shopping list
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const currentShoppingList = response.data.shopping_list

        let updatedShoppingList
        if (ingredient.shoppingList === true) {
          // Add the ingredient if it doesn't exist in the shopping list
          if (!currentShoppingList.some(item => item === ingredient._id)) {
            updatedShoppingList = [...currentShoppingList, ingredient]
            console.log(`Ingredient ${ingredient.name} added to shopping list.`)
          } else {
            console.log(`Ingredient ${ingredient.name} is already in the shopping list.`)
            updatedShoppingList = currentShoppingList // Don't add duplicate
          }
        } else {
          // Remove the ingredient if it's unchecked
          updatedShoppingList = currentShoppingList.filter(item => item !== (ingredient._id))
          console.log(`Ingredient ${ingredient.name} removed from shopping list.`)
        }

        // Update the user's shopping list
        await axios.patch(`http://localhost:3000/api/users/${userId}`, {
          shopping_list: updatedShoppingList
        })

        console.log(`Shopping list updated successfully for ${ingredient.name}.`)
      } catch (error) {
        console.error('Error updating shopping list:', error.response ? error.response.data : error.message)
      }
    }
  },
  async created() {
    if (this.isLoggedIn) {
      await this.fetchSuggestedRecipes()
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
      isLoggedIn: false,
      recipes: [],
      suggestedRecipes: [],
      showModal: false,
      showLoginPrompt: false,
      selectedRecipe: null,
      viewMode: 'grid',
      errorMessage: '',
      successMessage: '',
      showSuccessAlert: false,
      alreadySavedMessage: null,
      showAlreadySavedAlert: false
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
