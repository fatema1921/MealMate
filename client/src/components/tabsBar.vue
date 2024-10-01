<template>
    <b-container fluid class="tabs-bar">
      <b-nav tabs align = "center">
         <b-nav-item href="#">Home</b-nav-item>
        <b-nav-item href="#">My Recipes</b-nav-item>
        <b-nav-item href="#">Shopping list </b-nav-item>
        <b-nav-item href="#">My profile</b-nav-item>
        <b-nav-item href="#">Meal planner</b-nav-item>

      </b-nav>
    </b-container>
  </template>
  
  <script>
  export default {
    name: 'tabsBar',
  }
  </script>
  <style scoped>
  .tabs-bar {
    text-align: center;
  }
  </style>