<template>
  <div>
    <b-container fluid>
        <h1 class="display-5 fw-bold">Meal Mate</h1>
        <p class="fs-4">Welcome to Meal Mate, your personalized meal planning assistant!</p>
    </b-container>
    <Searchbox />
  </div>
</template>

<script>
// @ is an alias to /src
import Searchbox from '../components/searchbox.vue'

export default {
  name: 'home',
  methods: {
  },
  components: {
    Searchbox
  },
  data() {
    return {
      message: 'none'
    }
  }
}
</script>

<style scoped>
b-container {
  text-align: center;
  margin-top: 100px;
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
</style>
