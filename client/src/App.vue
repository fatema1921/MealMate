<template>
  <div id="app">
    <div id="top-page">
    <b-container fluid> 
    <header class="app-header"> 
        <h1 class="display-5 fw-bold">Meal Mate</h1>
        <p class="fs-4">Welcome to Meal Mate, your favorite meal planner</p> 
      </header>
    </b-container>

    <!-- Render the content of the current page view -->
    <router-view/>
    <tabsbar />
    
  </div>
  <searchbox /> 

    <div id ="footer">
      <b-container fluid>
        <footer class="app-footer">
      <p>This is our footer</p>
    </footer>
      </b-container>
    </div>
  </div>
</template>

<script>
import tabsbar from '@/components/tabsBar.vue'; 
import searchbox from '@/components/searchbox.vue';

export default {
  name: 'home',
  components: { 
    searchbox,  
    tabsbar 
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app-footer{
  background: #9FE2BF;

  
}
#top-page{
  background-color: #9FE2BF;
  padding: 20px;
  text-align: center;
}
</style>

// app.vue - styling for the whole app 