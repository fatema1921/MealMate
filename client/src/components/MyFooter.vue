<template>
  <b-container fluid class="footer">
     <b-row>
      <b-col>
        <p class="text-white">&copy; 2024 MealMate</p>
      </b-col>
     </b-row>
     <b-row>
      <b-col>
        <b-nav>
          <b-nav-item href="mailto:contact@mealmate.com" target="_blank">
            <b-icon icon="envelope-fill" class="text-white"></b-icon> Contact Us
          </b-nav-item>
        </b-nav>
      </b-col>
      <b-col>
        <b-nav>
          <b-nav-item href="https://github.com/yourrepo" target="_blank">
            <b-icon icon="github" class="text-white"></b-icon> GitHub
          </b-nav-item>
          <b-nav-item href="https://instagram.com/yourpage" target="_blank">
            <b-icon icon="instagram" class="text-white"></b-icon> Instagram
          </b-nav-item>
        </b-nav>
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
  cursor: pointer;
}
.text-white {
  color: white;
}
</style>
