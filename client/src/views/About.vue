<template>
  <div class="about-container container">
    <h1 class="text-center my-4">About MealMate</h1> 

    
    <section class="row info-section">
      <!-- Card 1 -->
      <div class="col-md-4 info-card mb-4"> 
        <img class="info-image img-fluid" src="https://t3.ftcdn.net/jpg/02/91/26/36/360_F_291263648_p6xUmn8znBXXiBDquzbAIiHsPk1rosnU.jpg" alt="Plan meals"> 
        <h2>Plan Your Meals</h2> 
        <p>Whether you follow a vegan, gluten-free, or traditional diet, Meal Mate has something for everyone. As your personalized meal planning assistant, our app makes it easy to plan your meals effortlessly. With our calendar, you'll gain a clear overview of your weekly meals, eliminating the stress and hassle of planning your meals each day. Once logged in, you'll receive tailored recipe recommendations based on your unique dietary preferences, ensuring that every meal is customized to suit your taste. Plus, you can save your favorite recipes for quick access in the future, making it simple to recreate delicious dishes time and time again.</p>
      </div>

      <!-- Card 2 -->
      <div class="col-md-4 info-card mb-4"> 
        <img class="info-image img-fluid" src="https://www.betterup.com/hs-fs/hubfs/Young-man-chopping-vegetables-in-the-kitchen-things-to-do-with-your-free-time.jpg?width=964&height=643&name=Young-man-chopping-vegetables-in-the-kitchen-things-to-do-with-your-free-time.jpg" alt="Save time">
        <h2>Save Time</h2> 
        <p>With Meal Mate, you'll save valuable time with a personalized shopping list that gathers all the ingredients you need in one convenient place. Our shopping list feature allows you to check off items as you shop, ensuring you have everything necessary to prepare delicious meals at home. Each recipe comes with a detailed list of ingredients, making it easy to add items to your shopping list for seamless grocery shopping. The Meal Planner is customized for each user and features a 7-day calendar layout, allowing you to plan your meals in advance. This feature helps you stay organized and make informed choices about your weekly meals.</p>
      </div>

      <!-- Card 3 -->
      <div class="col-md-4 info-card mb-4">
        <img class="info-image img-fluid" src="https://www.eatingwell.com/thmb/Ch2LFPGHsQ5kySirTzPLNd0LfdA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/14-days-clean-eating-meal-plan-1200-lede-601736337d914519bb5bf8eb83540da1.jpg" alt="Eat healthily">
        <h2>Eat Healthily</h2> 
        <p>Meal Mate offers a diverse array of recipes tailored to various dietary preferences—whether you're vegetarian, vegan, gluten-free, or simply looking to incorporate more whole foods into your diet. You'll find countless options to satisfy your cravings and inspire you to try new dishes. With Meal Mate, you can enjoy a greater variety of meals while staying committed to your health goals.
</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-container {
  padding: 30px; 
}

.info-card {
  text-align: center; 
}

.info-image {
  height: 250px;  
  border-radius: 10px; 
}

.info-card h2 {
  font-size: 1.5rem; 
  margin-top: 10px; 
}

.info-card p {
  font-size: 0.9rem; 
  margin-top: 5px; 
}
</style>
