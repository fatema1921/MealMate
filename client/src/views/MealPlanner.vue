<template>
  <div v-if="!isLoggedIn" class="center">
    <p class="login-message">You need to log in first to start planning.</p>
  </div>
  <div v-else>
    <b-container>
      <h1>Meal Planner</h1>
      <p>Plan your meals here.</p>

      <!-- Button to open the modal for creating a meal -->
      <b-button variant="primary" @click="showModal = true">Create a Meal</b-button>

      <!-- Button to fetch and display the user's meals -->
      <b-button variant="secondary" @click="getMeals">Show My Meals</b-button>

      <!-- Calendar component (no logic, just display) -->
      <v-calendar
        v-model="selectedDate"
        view="weekly"
        :first-day-of-week="1"
      />

      <!-- Mdal for creating a meal -->
      <b-modal v-model="showModal" title="Create a Meal" @ok="submitMealForm">
        <b-form>
          <!-- Input field for the name of the meal -->
          <b-form-group label="Name of the Meal" label-for="meal-name">
            <b-form-input
              id="meal-name"
              v-model="mealForm.name"
              placeholder="Enter meal name"
              required
            ></b-form-input>
          </b-form-group>

          <!-- Dropdown for selecting a recipe -->
          <b-form-group label="Select Recipe" label-for="recipe-select">
            <b-form-select
              id="recipe-select"
              v-model="mealForm.recipeId"
              :options="recipes"
              required
            ></b-form-select>
          </b-form-group>

          <!-- Dropdown for selecting a date within the next 7 days -->
          <b-form-group label="Select Date" label-for="meal-date">
            <b-form-select
              id="meal-date"
              v-model="mealForm.date"
              :options="next7Days"
              required
            ></b-form-select>
          </b-form-group>
        </b-form>
      </b-modal>

      <!-- Display meals as radio buttons -->
      <div v-if="meals.length">
        <h3>My Meals</h3>
        <b-form>
          <b-form-group>
            <b-form-radio-group v-model="selectedMeal">
              <b-form-radio
                v-for="meal in meals"
                :key="meal._id"
                :value="meal"
              >
                {{ meal.name }} - {{ new Date(meal.date).toLocaleDateString() }}
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <!-- Button to delete the selected meal -->
          <b-button variant="danger" @click="deleteMeal" v-if="selectedMeal">
            Delete Meal
          </b-button>
        </b-form>
      </div>
      <div v-else>
        <p>No meals found.</p>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedDate: new Date(), // current selected date
      isLoggedIn: !!localStorage.getItem('userId'), // Check login status
      userId: localStorage.getItem('userId'), // user ID from local storage
      showModal: false, // Controls modal visibility
      selectedMeal: null, // variable to hold the selected meal for deletion
      mealForm: {
        name: '', // name of the meal
        recipeId: '', // selected recipe ID
        date: '' // selected meal date
      },
      recipes: [], // Array to hold the user's recipes with recipe names
      next7Days: [], // Array to hold the upcoming 7 days for the date picker
      meals: [] // Array to store fetched meals
    }
  },
  methods: {
    // fetches meals associated with the logged-in user's calendar
    async getMeals() {
      try {
        // Get user data to get the associated calendar ID
        const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`)
        const calendarId = userResponse.data.calendar

        // Get the calendar to get the meal IDs
        const response = await axios.get(`http://localhost:3000/api/calendars/${calendarId}`)
        const mealIds = response.data.calendar.meals

        // check if there are no meals
        if (!mealIds || mealIds.length === 0) {
          console.warn(`No meals found for calendar ID ${calendarId}.`)
          this.meals = [] // set meals to an empty array
          return
        }

        // fetch meals using Promise.all for the meal IDs
        const mealRequests = mealIds.map(mealId =>
          axios.get(`http://localhost:3000/api/meals/${mealId}`)
            .then(response => response.data.meal) // extract meal data
            .catch(error => {
              console.warn(`Error fetching meal with ID ${mealId}: ${error.message}`)
              return null // return null for any failed requests
            })
        )

        const mealResponses = await Promise.all(mealRequests)

        // filter out null responses and assign to meals
        this.meals = mealResponses.filter(res => res !== null) // only keep valid meal objects

        // log the fetched meals
        if (this.meals.length === 0) {
          console.warn(`No valid meals found for calendar ID ${calendarId}.`)
        } else {
          console.log('Fetched Meals:', this.meals)
        }
      } catch (error) {
        console.error('Error fetching meals:', error) // log any errors
      }
    },

    // fetches the user's recipes from the server
    async getUserRecipes() {
      try {
        const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`)
        const recipeIds = userResponse.data.recipes

        // fetch each recipe's data and format it for the dropdown
        const recipePromises = recipeIds.map(async (recipeId) => {
          const recipeResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`)
          return { value: recipeId, text: recipeResponse.data.name }
        })

        // store all fetched recipes
        this.recipes = await Promise.all(recipePromises)
      } catch (error) {
        console.error('Error getting recipes:', error) // log any errors
      }
    },

    // generates the next 7 days for the date picker
    getNext7Days() {
      const days = []
      const today = new Date()
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i) // increment date by i days
        days.push({
          value: date.toISOString().split('T')[0], // format as YYYY-MM-DD
          text: date.toDateString() // human readable date
        })
      }
      this.next7Days = days // store the generated dates
    },

    // deletes the selected meal from the database and updates the calendar
    async deleteMeal() {
      if (this.selectedMeal) {
        try {
          const mealId = this.selectedMeal._id // get the ID of the selected meal

          // delete the meal from the meals collection
          await axios.delete(`http://localhost:3000/api/meals/${mealId}`)
          console.log(`Deleted meal with ID: ${mealId}`)

          // get the current calendar to remove the meal ID
          const calendarId = localStorage.getItem('calendarId')
          const calendarResponse = await axios.get(`http://localhost:3000/api/calendars/${calendarId}`)

          const calendar = calendarResponse.data.calendar // access the calendar object

          // check if meals exists before filtering
          if (calendar.meals && Array.isArray(calendar.meals)) {
            // remove the meal ID from the calendar's meals array
            calendar.meals = calendar.meals.filter(id => id !== mealId)
            console.log('Updated meals array after deletion:', calendar.meals)

            // PATCH to update the calendar with the new meals array
            const patchResponse = await axios.patch(`http://localhost:3000/api/calendars/${calendarId}`, { meals: calendar.meals })
            console.log('Patch response:', patchResponse.data) // log the response of the patch request

            // refresh meals after deletion
            await this.getMeals()
            this.selectedMeal = null // clear the selected meal variable after deletion
          } else {
            console.error('Meals array is undefined or not an array.')
          }
        } catch (error) {
          console.error('Error deleting meal:', error) // log errors
        }
      } else {
        console.error('Something went wrong') // log
      }
    },

    // create a meal
    async submitMealForm() {
      const { name, recipeId, date } = this.mealForm

      try {
        console.log('Creating meal with data:', { name, recipeId, date })

        const mealData = { name, recipeId, date } // prepare for post
        const createMealResponse = await axios.post('http://localhost:3000/api/meals', mealData)

        console.log('Meal creation response:', createMealResponse.data)
        const mealId = createMealResponse.data.meal._id // get the ID of the created meal

        const calendarId = localStorage.getItem('calendarId')
        console.log('Calendar ID:', calendarId)

        // add the new meal to the user's calendar
        await axios.post(`http://localhost:3000/api/calendars/${calendarId}/meals/${mealId}`, { date })

        this.showModal = false // close the modal after submission

        // refresh meals
        await this.getMeals()
      } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message) // logging
      }
    }
  },
  mounted() {
    // get user data only if the user is logged in
    if (this.isLoggedIn) {
      this.getUserRecipes() // get user's recipes
      this.getNext7Days() // generate the next 7 days for the date picker
      this.getMeals() // get initial meals
    }
  }
}
</script>

<style scoped>
.login-message {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
