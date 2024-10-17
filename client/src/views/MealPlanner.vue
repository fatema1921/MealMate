<template>
  <div v-if="!isLoggedIn" class="center">
    <p class="login-message">You need to log in first to start planning.</p>
  </div>
  <div v-else>
    <b-container>
      <h1>Meal Planner</h1>
      <p>Plan your meals here.</p>
      
      <!-- "Create a Meal" Button -->
      <b-button variant="primary" @click="showModal = true">Create a Meal</b-button>

      <!-- Calendar View -->
      <v-calendar
        v-model="selectedDate"
        :attributes="calendarEvents"
        view="weekly"
        :first-day-of-week="1"
        :events="calendarEvents"
      />

      <!-- Modal for Creating a Meal -->
      <b-modal v-model="showModal" title="Create a Meal" @ok="submitMealForm">
        <b-form>
          <!-- Name of the Meal -->
          <b-form-group label="Name of the Meal" label-for="meal-name">
            <b-form-input
              id="meal-name"
              v-model="mealForm.name"
              placeholder="Enter meal name"
              required
            ></b-form-input>
          </b-form-group>

          <!-- Recipe Dropdown -->
          <b-form-group label="Select Recipe" label-for="recipe-select">
            <b-form-select
              id="recipe-select"
              v-model="mealForm.recipe"
              :options="recipes"
              required
            ></b-form-select>
          </b-form-group>

          <!-- Date Picker (Next 7 Days) -->
          <b-form-group label="Select Date" label-for="meal-date">
            <b-form-select id="meal-date" v-model="mealForm.date" :options="next7Days" required>
            </b-form-select>
          </b-form-group>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedDate: new Date(),
      calendarEvents: [],
      isLoggedIn: !!localStorage.getItem('userId'), // Check login status
      userId: localStorage.getItem('userId'),
      showModal: false, // Controls modal visibility
      mealForm: {
        name: '',
        recipe: '',
        date: '',
      },
      recipes: [], // Array to hold the user's recipes with recipe names
      next7Days: [] // Array to hold the upcoming 7 days for the date picker
    };
  },
  methods: {
    async getCalendar() {
      if (this.userId) {
        try {
          const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`);
          const calendarId = userResponse.data.calendar;
          const calendarResponse = await axios.get(`http://localhost:3000/api/calendars/${calendarId}`);
          this.calendarEvents = calendarResponse.data.meals;
        } catch (error) {
          console.error('Error fetching calendar:', error);
        }
      }
    },
    async fetchUserRecipes() {
      try {
        // Step 1: Get the user's recipe IDs from the User model
        const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`);
        const recipeIds = userResponse.data.recipes;

        // Step 2: For each recipeId, make a GET request to retrieve the recipe details
        const recipePromises = recipeIds.map(async (recipeId) => {
          const recipeResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
          return { value: recipeId, text: recipeResponse.data.name };
        });

        // Step 3: Wait for all recipe requests to complete and set the recipes array
        this.recipes = await Promise.all(recipePromises);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    },
    getNext7Days() {
      const days = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
          value: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          text: date.toDateString(), // Human-readable date
        });
      }
      this.next7Days = days;
    },
    async submitMealForm() {
      const { name, recipe, date } = this.mealForm;

      try {
        // Step 1: Create the meal
        const createMealResponse = await axios.post("http://localhost:3000/api/meals", {
          name,
          recipe,
        });
        const mealId = createMealResponse.data._id;

        // Step 2: Add the meal to the user's calendar for the selected date
        const calendarId = localStorage.getItem("calendarId"); // Assuming calendar ID is stored
        await axios.post(`http://localhost:3000/api/calendars/${calendarId}/meals/${mealId}`, { date });

        this.$bvToast.toast("Meal added to your calendar!", { variant: "success" });
        this.showModal = false;
        this.getCalendar(); // Refresh calendar events after adding the meal
      } catch (error) {
        this.$bvToast.toast("Error adding meal to calendar.", { variant: "danger" });
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getCalendar(); // Fetch calendar events if the user is logged in
      this.fetchUserRecipes(); // Fetch user's recipes
      this.getNext7Days(); // Generate the next 7 days for date picker
    }
  }
};
</script>

<style scoped>
.login-message {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
