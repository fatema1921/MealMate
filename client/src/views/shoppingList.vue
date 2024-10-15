<template>
  <div class="shopping-list">
    <h2>Your Shopping List</h2>
    <ul>
      <li v-for="ingredient in shoppingList" :key="ingredient._id">
        {{ ingredient.name }}
      </li>
    </ul>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data(){
    return {
      shoppingList: [ ], 
      message: '', 
    }
  },
  methods: {
    async fetchShoppingList (){
      const userId = localStorage.getItem('userId'); 

      try{
        const user = await axios.get(`http://localhost:3000/api/users/${userId}`);
        const ingredientIds = user.data.shopping_list; 

        console.log (ingredientIds); 

        const ingredientPromises = ingredientIds.map(id => axios.get(`http://localhost:3000/api/ingredients/${id}`)); // iterates thrugh each id in ingredientsId and applies the get function to each id.  
        const ingredientsResponses = await Promise.all(ingredientPromises);
        
        this.shoppingList = ingredientsResponses.map(res => res.data);
      } catch (error) {
        console.error('Error fetching shopping list:', error);
        this.message = 'Error fetching shopping list';
      }
    }
  },

  mounted (){
      this.fetchShoppingList();
    }
};
</script>
