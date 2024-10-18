<template>
  <div v-if="!isLoggedIn" class="center">
    <p class="login-message">You need to log in first to start planning.</p>
  </div>
  <div v-else>
    <b-container>
      <h1>Meal Planner</h1>
      <p>Plan your meals here.</p>

      <!-- Create a Meal -->
      <b-button variant="primary" @click="showModal = true">Create a Meal</b-button>

      <!-- Show My Meals -->
      <b-button variant="secondary" @click="getMeals">Show My Meals</b-button>

      <!-- Calendar -->
      <v-calendar
        v-model="selectedDate"
        :events="calendarEvents"
        view="weekly"
        :first-day-of-week="1"
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
              v-model="mealForm.recipeId"
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

      <!-- Display Meals -->
      <div v-if="meals.length">
        <h3>My Meals</h3>
        <ul>
          <li v-for="meal in meals" :key="meal._id">
            {{ meal.name }} - {{ new Date(meal.date).toLocaleDateString() }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No meals found.</p>
      </div>
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
        recipeId: '',
        date: '',
      },
      recipes: [], // Array to hold the user's recipes with recipe names
      next7Days: [], // Array to hold the upcoming 7 days for the date picker
      meals: [], // Array to store fetched meals
    };
  },
  methods: {
    async getMeals() {
  try {
    // Get user data to get the calendar ID
    const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`);
    const calendarId = userResponse.data.calendar;

    // Get meals associated with that calendar
    const response = await axios.get(`http://localhost:3000/api/calendars/${calendarId}`);
    const mealIds = response.data.calendar.meals;

    // Get each meal's details
    const mealRequests = mealIds.map(mealId => axios.get(`http://localhost:3000/api/meals/${mealId}`));
    const mealResponses = await Promise.all(mealRequests);

    // Extract meal data
    this.meals = mealResponses.map(res => res.data.meal);
    
    console.log('Fetched Meals:', this.meals); // Log the fetched meals
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
},
    async getCalendar() {
      if (this.userId) {
        try {
          const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`);
          const calendarId = userResponse.data.calendar;

          const calendarResponse = await axios.get(`http://localhost:3000/api/calendars/${calendarId}`);
          console.log('Full Calendar Response:', calendarResponse.data);

          if (calendarResponse.data.calendar && Array.isArray(calendarResponse.data.calendar.meals)) {
            const mealIds = calendarResponse.data.calendar.meals;

            const mealRequests = mealIds.map(mealId => axios.get(`http://localhost:3000/api/meals/${mealId}`));
            const mealResponses = await Promise.all(mealRequests);

            console.log('Meal Responses:', mealResponses);

            this.calendarEvents = mealResponses.map(response => {
              const meal = response.data.meal; // Ensure you're accessing `meal` from the response
              const mealDate = meal.date ? new Date(meal.date) : null; // Handle null dates

              return {
                start: mealDate && !isNaN(mealDate.getTime()) ? mealDate : 'Invalid Date',
                title: meal.name || "Unnamed Meal",
              };
            });

            console.log('Calendar Events:', this.calendarEvents); // Debug calendar events
          } else {
            console.log('No meals found for this calendar.');
            this.calendarEvents = [];
          }
        } catch (error) {
          console.error('Error getting calendar:', error);
        }
      }
    },
    async getUserRecipes() {
      try {
        const userResponse = await axios.get(`http://localhost:3000/api/users/${this.userId}`);
        const recipeIds = userResponse.data.recipes;

        const recipePromises = recipeIds.map(async (recipeId) => {
          const recipeResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
          return { value: recipeId, text: recipeResponse.data.name };
        });

        this.recipes = await Promise.all(recipePromises);
      } catch (error) {
        console.error('Error getting recipes:', error);
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
      const { name, recipeId, date } = this.mealForm;

      try {
        console.log('Creating meal with data:', { name, recipeId, date });

        const mealData = { name, recipeId, date };
        const createMealResponse = await axios.post('http://localhost:3000/api/meals', mealData);

        console.log('Meal creation response:', createMealResponse.data);
        const mealId = createMealResponse.data.meal._id;

        const calendarId = localStorage.getItem("calendarId");
        console.log('Calendar ID:', calendarId);

        await axios.post(`http://localhost:3000/api/calendars/${calendarId}/meals/${mealId}`, { date });

        this.$bvToast.toast("Meal added to your calendar!", { variant: "success" });
        this.showModal = false;

        // Refresh calendar events
        await this.getCalendar();
      } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        this.$bvToast.toast("Error adding meal to calendar.", { variant: "danger" });
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getCalendar(); // get calendar events if the user is logged in
      this.getUserRecipes(); // get user's recipes
      this.getNext7Days(); // Generate the next 7 days for date picker
    }
  },
};
</script>

<style scoped>
.login-message {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
