<template>
    <div>
      <h1>This is the recipe site!</h1> 
  
      <div v-for="recipe in recipes" :key="recipe._id">
        <h3>{{ recipe.name }}</h3>
        <p><strong>Description:</strong> {{ recipe.description }}</p> 
      </div>
    </div>
  </template>

<script> 
import { Api } from '@/Api';

export default{
  data() {
    return {
      message: 'none',
      recipes :[]
    };
  },
  methods: {
    async getAllRecipes(){
      try{
        const response = await Api.get('/recipes')
        console.log(response); 
        this.recipes = response.data
      }catch(error){
        console.log("error getting recipes"); 
        console.log(error);

    }
  },
},
async mounted (){
    this.getAllRecipes();

}
}
</script>