<template>
  <div>
    <h1>My Recipes</h1>

    <!-- If user is not logged in, show login message -->
    <div v-if="!isLoggedIn">
      <p class="text-center">Please log in to see your recipes.</p>
    </div>

    <!-- If user is logged in, show the recipes interface -->
    <div v-else>
      <!-- Radio buttons for filtering recipes -->
      <b-row class="d-flex justify-content-center mt-3">
        <b-col md="6">
          <b-form-group>
            <b-form-radio-group v-model="selectedFilter" name="recipeFilter">
              <b-form-radio value="all" :class="['custom-radio', selectedFilter === 'all' ? 'active-radio' : '']">
                All
              </b-form-radio>
              <b-form-radio value="saved" :class="['custom-radio', selectedFilter === 'saved' ? 'active-radio' : '']">
                Saved recipes
              </b-form-radio>
              <b-form-radio value="created" :class="['custom-radio', selectedFilter === 'created' ? 'active-radio' : '']">
                My own recipes
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Toggle between Grid and List view -->
      <b-row class="d-flex justify-content-center mb-3">
        <b-col md="4">
          <b-button-group class="view-toggle" block>
            <b-button
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
            >
              Grid
            </b-button>
            <b-button
              :class="['toggle-btn', { active: viewMode === 'list' }]"
              @click="viewMode = 'list'"
            >
              List
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>

      <!-- Show recipes based on selected filter -->
      <b-container fluid class="mt-4">
        <!-- Show message if there are no recipes -->
        <p v-if="filteredRecipes.length === 0" class="text-center">
          {{ noRecipesMessage }}
        </p>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid' && filteredRecipes.length">
          <b-row>
            <b-col v-for="recipe in filteredRecipes" :key="recipe._id" md="4" class="mb-3">
              <b-card
                :title="recipe.name"
                class="text-center"
                @click="showRecipeDetails(recipe)"
              >
              </b-card>
            </b-col>
          </b-row>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredRecipes.length">
          <b-list-group>
            <b-list-group-item
              v-for="recipe in filteredRecipes"
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
          </div>
        </b-modal>

      </b-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // isLoggedIn: !!localStorage.getItem('userId'),
      isLoggedIn: true,
      userRecipes: [],
      filteredRecipes: [],
      selectedFilter: 'all', // Default filter is 'all'
      viewMode: 'grid', // Default view mode is 'grid'
      noRecipesMessage: '',
      showModal: false,
      selectedRecipe: null
    }
  },
  methods: {
    // Fetch all recipes associated with the user
    async fetchUserRecipes() {
      // const userId = localStorage.getItem('userId')
      const userId = '66f18ee5dc8b72b161275216'
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const recipeIds = response.data.recipes
        console.log('Fetched user recipes:', response.data.recipes) // for debugging purposes

        for (const recipeId of recipeIds) {
          try {
            const recipeResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`)
            this.userRecipes.push(recipeResponse.data) // Push the recipe details into the array
          } catch (error) {
            console.error(`Error fetching recipe ${recipeId}:`, error) // Handle errors for individual recipe fetch
          }
        }
        this.filterRecipes() // Apply the filter initially
      } catch (error) {
        console.error('Error fetching user recipes:', error)
      }
    },
    // Filter the recipes based on the selected filter
    filterRecipes() {
      console.log('Current filter:', this.selectedFilter) // for debugging purposes
      if (this.selectedFilter === 'all') {
        this.filteredRecipes = this.userRecipes
        this.noRecipesMessage = 'You have no saved/created recipes yet.'
      } else if (this.selectedFilter === 'saved') {
        this.filteredRecipes = this.userRecipes.filter(recipe => !recipe.userMade)
        this.noRecipesMessage = 'You have no saved recipes yet.'
      } else if (this.selectedFilter === 'created') {
        this.filteredRecipes = this.userRecipes.filter(recipe => recipe.userMade)
        this.noRecipesMessage = 'You have not created a recipe yet.'
      }
      console.log('Filtered recipes:', this.filteredRecipes) // for debugging purposes
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
      this.showModal = false
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
  watch: {
    // Re-apply filter when user changes the selected filter
    selectedFilter() {
      this.filterRecipes()
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.fetchUserRecipes() // Fetch recipes when the component is created if user is logged in
    }
  }
}
</script>

<style scoped>
/* Background and Button Colors */
body {
  background-color: var(--background-color);
  color: #2C3E50;
}

.custom-radio {
  background-color: var(--background-color);
  border-color: var(--button-color);
  margin-right: 10px;
  padding: 10px 15px;
  cursor: pointer;
}

.active-radio {
  background-color: var(--button-color);
  border-color: var(--button-color);
  color: white;
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

b-container {
  text-align: center;
  margin-top: 50px;
}

.btn-primary {
  background-color: var(--button-color);
  border-color: var(--button-color);
}

.btn-primary:hover {
  background-color: var(--button-hover-color);
  border-color: var(--button-hover-color);
}
</style>
