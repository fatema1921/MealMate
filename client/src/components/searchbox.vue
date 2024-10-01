<template>
  <div class="search-box">
    <b-form-group label="Search for Recipes:" label-for="search-input">
      <b-form-input
        id="search-input"
        v-model="searchQuery"
        placeholder="Type to search for a recipe..."
      ></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'searchbox',
  data() {
    return {
      searchQuery: ''
    }
  }
}
</script>

<style scoped>
.search-box {
  margin-top: 1em;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
