<template>
  <div>
    <b-container fluid>
      <header class = "header"> 
        <h1 class="display-5 fw-bold">Meal Mate</h1>
        <p class="fs-4">Welcome to Meal Mate, your favorite meal planner</p> 
      </header>
      <tabsbar />    
    <searchbox /> 

    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import tabsbar from '@/components/tabsBar.vue'; 
import searchbox from '@/components/searchbox.vue';

export default {
  name: 'home',
  components: { 
    searchbox,  
    tabsbar 
  },
  data() {
    return {
      message: 'none'
    }
  },
}
</script>

<style>



</style>
