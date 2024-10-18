<template>
  <div>
    <h1>My Recipes</h1>

    <!-- If user is not logged in, show login message -->
    <div v-if="!(globalState.isLoggedIn)">
      <p class="text-center">Please log in to see your recipes.</p>
    </div>

    <!-- If user is logged in, show the recipes interface -->
    <div v-else>
      <!-- Create a New Recipe Button -->
      <b-container fluid>
        <b-button variant="primary" @click="showCreateRecipeModal = true">
          Create a New Recipe
        </b-button>
      </b-container>

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
            <b-button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">Grid</b-button>
            <b-button :class="['toggle-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">List</b-button>
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
              <b-card :title="recipe.name" class="text-center" @click="showRecipeDetails(recipe)">
              </b-card>
            </b-col>
          </b-row>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredRecipes.length">
          <b-list-group>
            <b-list-group-item v-for="recipe in filteredRecipes" :key="recipe._id" class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ recipe.name }}</h5>
              <p class="mb-0">{{ recipe.description }}</p>
            </b-list-group-item>
          </b-list-group>
        </div>

        <!-- Recipe Details Modal -->
        <b-modal v-model="showModal" title="Recipe Details" hide-footer @hide="closeModal" size="lg">
          <div v-if="selectedRecipe">
            <h4>{{ selectedRecipe.name }}</h4>
            <p class="text-muted mb-3">Note: Checking the box next to each ingredient adds it to your shopping list.</p>

            <!-- Ingredients Section -->
            <h5>Ingredients</h5>
            <div class="ingredients-list">
              <b-row v-for="(ingredient, index) in selectedRecipe.ingredients" :key="ingredient._id" class="align-items-center mb-2">
                <b-col cols="1">
                  <b-form-checkbox
                    @change="updateShoppingList(ingredient)"
                  ></b-form-checkbox>
                </b-col>
                <b-col>{{ ingredient.name }} - {{ ingredient.calories }} kcal</b-col>
              </b-row>
            </div>

            <!-- Description Section -->
            <h5 class="mt-4">Description</h5>
            <p>{{ selectedRecipe.description }}</p>
          </div>
        </b-modal>

        <!-- Create Recipe Modal -->
        <b-modal v-model="showCreateRecipeModal" title="Create New Recipe" size="lg" hide-footer>
          <b-form>
            <b-form-group label="Recipe Name" label-for="recipe-name">
              <span v-if="!newRecipe.name" class="text-danger">* Required</span>
              <b-form-input id="recipe-name" v-model="newRecipe.name" required></b-form-input>
            </b-form-group>

            <p> </p>
            <p> </p>
            <p> </p>

            <b-form-group label="Meal Category">
              <span v-if="!newRecipe.meal_category" class="text-danger">* Required</span>
              <b-form-select v-model="newRecipe.meal_category" :options="mealCategories"></b-form-select>
            </b-form-group>

            <p> </p>
            <p> </p>
            <p> </p>

            <b-form-group label="Preparation Time (in minutes)">
              <b-form-input type="number" v-model="newRecipe.prepTime"></b-form-input>
            </b-form-group>

            <p> </p>
            <p> </p>
            <p> </p>

            <!-- Ingredients Field with Dropdown and Checkboxes -->
            <b-form-group label="Ingredients">
              <b-form-select
                v-model="selectedIngredient"
                :options="filteredIngredients"
                @change="addIngredient"
                :disabled="filteredIngredients.length === 0"
                placeholder="Search ingredients..."
              ></b-form-select>
            </b-form-group>

            <!-- Selected Ingredients List -->
            <div v-if="newRecipe.ingredients.length">
              <p>Selected Ingredients:</p>
              <b-list-group>
                <b-list-group-item
                  v-for="(ingredient, index) in newRecipe.ingredients"
                  :key="ingredient._id"
                >
                  <b-form-checkbox
                    v-model="ingredient.selected"
                    @change="removeIngredient(ingredient)"
                  >
                    {{ ingredient.name }} - {{ ingredient.calories }} kcal
                  </b-form-checkbox>
                </b-list-group-item>
              </b-list-group>
            </div>

            <p> </p>
            <p> </p>
            <p> </p>

            <b-form-group label="Description">
              <b-form-textarea v-model="newRecipe.description"></b-form-textarea>
            </b-form-group>

            <p> </p>
            <p> </p>
            <p> </p>

            <b-button variant="primary" @click="addNewRecipe">Add the recipe</b-button>
            <b-button variant="secondary" @click="showDiscardConfirmation = true">Discard changes</b-button>
          </b-form>
        </b-modal>

        <!-- Discard Confirmation Modal -->
        <b-modal v-model="showDiscardConfirmation" hide-footer>
          <div class="text-center">
            <p>Are you sure you want to discard the recipe?</p>
            <b-button variant="danger" @click="discardRecipe">Yes</b-button>
            <b-button variant="secondary" @click="showDiscardConfirmation = false">No</b-button>
          </div>
        </b-modal>
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { inject } from 'vue'

export default {
  data() {
    return {
      // isLoggedIn: this.$isLoggedIn,
      userRecipes: [],
      filteredRecipes: [],
      selectedFilter: 'all',
      viewMode: 'grid',
      noRecipesMessage: '',
      showModal: false,
      selectedRecipe: null,
      showCreateRecipeModal: false,
      showDiscardConfirmation: false,
      newRecipe: {
        name: '',
        meal_category: '',
        prepTime: null,
        calories: null,
        description: '',
        ingredients: []
      },
      mealCategories: [
        { value: '', text: 'None' },
        { value: 'Vegan', text: 'Vegan' },
        { value: 'Vegetarian', text: 'Vegetarian' },
        { value: 'Gluten-free', text: 'Gluten-free' },
        { value: 'High-protein', text: 'High-protein' }
      ],
      ingredientsList: [], // List of all ingredients from the database
      selectedIngredients: [], // The ingredients selected by the user
      filteredIngredients: [],
      selectedIngredient: null, // Used for dropdown selection
      searchQuery: '' // User's search query for ingredients
    }
  },
  methods: {
    // Fetch all recipes associated with the user
    async fetchUserRecipes() {
      const userId = localStorage.getItem('userId')
      // const userId = '66f18ee5dc8b72b161275216'
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const recipeIds = response.data.recipes

        for (const recipeId of recipeIds) {
          try {
            const recipeResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`)
            this.userRecipes.push(recipeResponse.data)
          } catch (error) {
            console.error(`Error fetching recipe ${recipeId}:`, error)
          }
        }
        this.filterRecipes()
      } catch (error) {
        console.error('Error fetching user recipes:', error)
      }
    },
    async fetchIngredients() {
      try {
        const response = await axios.get('http://localhost:3000/api/ingredients')
        this.ingredientsList = response.data
        // Populate the dropdown with available ingredients
        this.filteredIngredients = this.ingredientsList.map((ingredient) => ({
          value: ingredient._id,
          text: `${ingredient.name} - ${ingredient.calories} kcal`
        }))
      } catch (error) {
        console.error('Error fetching ingredients:', error)
      }
    },
    // Add selected ingredient to the list
    addIngredient() {
      const selected = this.ingredientsList.find(
        (ingredient) => ingredient._id === this.selectedIngredient
      )

      if (selected && !this.newRecipe.ingredients.some((ing) => ing._id === selected._id)) {
        // Add the selected ingredient to the list, ensuring no duplicates
        this.newRecipe.ingredients.push({
          ...selected,
          selected: true // Mark as selected
        })
        this.selectedIngredient = null // Reset dropdown
      }
    },

    // Handle removing an ingredient
    removeIngredient(ingredient) {
      this.newRecipe.ingredients = this.newRecipe.ingredients.filter(
        (ing) => ing._id !== ingredient._id
      )
    },

    // Add new recipe
    async addNewRecipe() {
      const userId = localStorage.getItem('userId')
      // const userId = '66f18ee5dc8b72b161275216'

      if (!this.newRecipe.name || !this.newRecipe.ingredients.length) {
        alert('Please fill in all required fields.')
        return
      }

      console.log(`newRecipe is : ${this.newRecipe}`)

      try {
        const response = await axios.post('http://localhost:3000/api/recipes', {
          ...this.newRecipe,
          userMade: true // Set userMade to true for user-created recipes
        })

        // Log the entire response object
        console.log('Full response from API:', response)

        const recipeId = response.data.newRecipe._id
        console.log(`recipeId is: ${recipeId}`)

        if (!recipeId) {
          console.error('Failed to get recipeId from the response')
          return
        }

        // Add the created recipe ID to the user's list of recipes
        const userRecipeResponse = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const userRecipeIds = userRecipeResponse.data.recipes
        await axios.patch(`http://localhost:3000/api/users/${userId}`, {
          recipes: [...userRecipeIds, recipeId]
        })

        // Close the modal and clear the form
        this.showCreateRecipeModal = false
        this.newRecipe = {
          name: '',
          meal_category: '',
          prepTime: null,
          calories: null,
          description: '',
          ingredients: [] // Clear the ingredients after submission
        }
      } catch (error) {
        console.error('Error adding recipe:', error)
      }
    },
    discardRecipe() {
      this.showCreateRecipeModal = false
      this.showDiscardConfirmation = false
    },
    // Filter recipes based on the selected filter
    filterRecipes() {
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
    },
    async showRecipeDetails(recipe) {
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
    },
    checkLoginStatus() {
      this.$router.go() // Reload the component to reflect the new state
    }
  },
  watch: {
    selectedFilter() {
      this.filterRecipes()
    }
  },
  created() {
    this.fetchUserRecipes()
    this.fetchIngredients()
  },
  mounted() {
    window.addEventListener('authChange', this.checkLoginStatus)
  },
  beforeUnmount() {
    window.removeEventListener('authChange', this.checkLoginStatus)
  },
  setup() {
    const globalState = inject('globalState')
    return { globalState }
  }
}
</script>

<style scoped>
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
