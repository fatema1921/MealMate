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
      calendarEvents: []  // Array to hold calendar events (meals)
    };
  },
  methods: {
    async getCalendar() {  // Get calendar events (meals) from the API, new endpoint needed??
    }
  },
  mounted() {
    this.getCalendar(); // Get calendar events when mounted
  }
};
</script>

<style>
</style>
