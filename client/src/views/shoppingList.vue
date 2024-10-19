<template>
  <div class="container shopping-list">
    <h2>Your Shopping List</h2>
    <ul>
      <li
      v-for="ingredient in shoppingList"
      :key="ingredient._id"
      :class=" {checked: ingredient.checked}"
      @click="toggleChecked(ingredient)">

          {{ ingredient.name }}
      </li>
    </ul>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      shoppingList: [],
      message: ''
    }
  },
  methods: {
    async fetchShoppingList() {
      const userId = localStorage.getItem('userId')

      try {
        const user = await axios.get(`http://localhost:3000/api/users/${userId}`)
        const ingredientIds = user.data.shopping_list

        console.log(ingredientIds)
        // iterates thrugh each id in ingredientsId and applies the get function to each id
        const ingredientPromises = ingredientIds.map(id => axios.get(`http://localhost:3000/api/ingredients/${id}`))
        const ingredientsResponses = await Promise.all(ingredientPromises)

        this.shoppingList = ingredientsResponses.map(res => res.data)
      } catch (error) {
        console.error('Error fetching shopping list:', error)
        this.message = 'You must be logged in to access you shopping list'
      }
    },
    toggleChecked(ingredient) {
      ingredient.checked = !ingredient.checked
    }
  },

  mounted() {
    this.fetchShoppingList()
  }
}
</script>

<style scoped>

.shopping-list {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
}

.shopping-list h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

ul{
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  cursor: pointer;
  padding: 12px 8px 12px 40px;
  background: #eee;
  font-size: 18px;
  transition: 0.2s; /* Transition effect */
}

li:hover{
  background: #ddd;
}
li.checked {
  background: #888;
  color: #fff;
  text-decoration: line-through;

}

</style>
