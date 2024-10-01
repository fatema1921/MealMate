<template>
  <div id="app">
    <header class="app-header"></header>

    <!-- Render the content of the current page view -->
    <router-view/>
    <tabsbar />    
    <searchbox /> 
    <footer class="app-footer">
      <p>This is our footer</p>
    </footer>
    
  </div>
</template>

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
.header {
  background-color: #9FE2BF;
  padding: 20px;
  text-align: center;
}
</style>

// app.vue - styling for the whole app 