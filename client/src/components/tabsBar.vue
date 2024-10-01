<template>
    <b-container fluid class="tabs-bar">
      <b-nav tabs align = "center">
         <b-nav-item :to="{ path: '/'}">Home</b-nav-item>
        <b-nav-item :to= "{ path: '/myRecipes' }">My Recipes</b-nav-item>
        <b-nav-item :to= "{ path: '/shoppingList' }">Shopping list </b-nav-item>
        <b-nav-item href="#">My profile</b-nav-item>
        <b-nav-item href="#">Meal planner</b-nav-item>

      </b-nav>
    </b-container>
  </template>

<script>
export default {
  name: 'tabsBar'
}
</script>
<style scoped>
.tabs-bar {
  text-align: center;
}
</style>
