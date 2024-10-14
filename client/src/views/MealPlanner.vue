<template>
  <div>
    <b-container>
      <h1>Meal Planner</h1>
      <p>Plan your meals here.</p>
    </b-container>
    
    <div>
      <v-calendar
        v-model="selectedDate"
        :attributes="calendarEvents"
        view="weekly"
        :first-day-of-week="1"
        :events="calendarEvents"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: new Date(),  // The currently selected date on the calendar
      calendarEvents: [],  // Array to hold calendar events (meals)
    };
  },
  methods: {
    async getCalendar() {  // not complete
    }
  },
    async addMeal() {
      const calendarId = ''; // not complete
      const mealId = ''; // not complete
      try {
      await axios.post(`http://localhost:3000/api/calendars/${calendarId}/meals/${mealId}`);
      this.getCalendar(); // Refresh the calendar
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  },
  mounted() {
    this.getCalendar(); // Get calendar events when mounted
  }
};
</script>

<style>
</style>
