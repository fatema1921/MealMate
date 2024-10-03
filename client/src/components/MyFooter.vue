<template>
  <b-container fluid class="footer">
    <b-row>
      <b-col>
        <p class="text-white">&copy; 2024 MealMate</p>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col cols="auto">
        <a href="mailto:contact@mealmate.com" target="_blank" class="footer-icon">
          <i class="fas fa-envelope"></i> Email
        </a>
      </b-col>
      <b-col cols="auto">
        <a href="https://github.com/yourrepo" target="_blank" class="footer-icon">
          <i class="fab fa-github"></i> GitHub
        </a>
        <a href="https://instagram.com/yourpage" target="_blank" class="footer-icon">
          <i class="fab fa-instagram"></i> Instagram
        </a>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {

}
</script>

<style scoped>
.footer-icon {
  margin: 0 10px;
  font-size: 1.5em;
  color: white;
  cursor: pointer;
  text-decoration: none;
}

.footer-icon:hover {
  color: var(--navbar-active-text-color);
}

.text-white {
  color: white;
}
</style>
