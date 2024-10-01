<template>
  <div id="app" class="d-flex flex-column min-vh-100">
     <!-- Navbar -->
    <b-navbar toggleable="lg" class="navbar-custom justify-content-end">
      <b-navbar-brand href="#">MealMate</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/" exact :active-class="'active-tab'" :exact-active-class="'exact-active-tab'">Home</b-nav-item>
          <b-nav-item to="/recipes" :active-class="'active-tab'">My Recipes</b-nav-item>
          <b-nav-item to="/shopping-list" :active-class="'active-tab'">Shopping List</b-nav-item>
          <b-nav-item to="/meal-planner" :active-class="'active-tab'">Meal Planner</b-nav-item>
          <b-nav-item to="/profile" :active-class="'active-tab'">My Profile</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Main content -->
    <div class="flex-grow-1">
      <!-- Render the content of the current page view -->
      <router-view/>
    </div>

    <!-- Footer -->
    <MyFooter />
  </div>
</template>

<script>
import MyFooter from './components/MyFooter.vue'

export default {
  name: 'App',
  components: {
    MyFooter
  }
}
</script>

<style>
:root {
  --navbar-bg-color: #d69468; /* Pumpkin orange */
  --navbar-text-color: #FDFEFE; /* Light ivory */
  --navbar-active-text-color: #a63721; /* Warm yellow */
  --button-color: #E74C3C; /* Crimson red */
  --button-hover-color: #C0392B; /* Darker red */
  --background-color: #f4e2c6; /* Light beige */
  --footer-bg-color: #d69468; /* Deep brown */
  --footer-text-color: #FDFEFE; /* Light ivory */
  --text-color: #2C3E50; /* Default text color */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}
.app-container {
  background-color: var(--background-color);
}

/* Ensure content pushes footer to bottom */
.flex-grow-1 {
  flex-grow: 1;
}

/* Active tab styles */
.active-tab {
  color: var(--navbar-active-text-color) !important;
  font-weight: bold; /* Optional: Make active tab bold */
}

.exact-active-tab {
  color: var(--navbar-active-text-color) !important;
}

/* Normal nav link styling */
.b-nav-item {
  color: var(--navbar-text-color) !important;
}

.ml-auto {
  margin-left: auto !important;
}

/* Navbar Color */
.navbar-custom {
  background-color: var(--navbar-bg-color) !important;
  color: var(--navbar-text-color);
}

.navbar-custom a {
  color: var(--navbar-text-color) !important;
}

.navbar-custom a:hover, .router-link-exact-active {
  color: var(--navbar-active-text-color) !important;
}

/* Background and Button Colors */
body {
  background-color: var(--background-color);
  color: #2C3E50;
}

.btn_message, .btn-primary {
  background-color: var(--button-color);
  border-color: var(--button-color);
}

.btn_message:hover, .btn-primary:hover {
  background-color: var(--button-hover-color);
  border-color: var(--button-hover-color);
}

/* Footer styles */
.footer {
  background-color: var(--footer-bg-color);
  color: var(--footer-text-color);
  padding: 1.5em 0;
  text-align: center;
  width: 100%;
}

.footer a {
  color: var(--footer-text-color);
  margin: 0 10px;
  font-size: 1.5em;
}

.footer a:hover {
  color: var(--navbar-active-text-color);
}
</style>
