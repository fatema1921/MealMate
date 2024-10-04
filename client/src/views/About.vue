<template>
  <div class="about-container">
    <h1> About us </h1>
    <section class="info-section">
      <div class="info-card">
        <img class="info-image" src="https://t3.ftcdn.net/jpg/02/91/26/36/360_F_291263648_p6xUmn8znBXXiBDquzbAIiHsPk1rosnU.jpg" alt="Plan meals">
        <h2>Plan Your Meals</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, rem! Quasi, consequuntur molestiae? Iusto voluptas perspiciatis quae. Perspiciatis nobis numquam, temporibus consequatur sint ullam. Animi modi officia voluptate vero quaerat..</p>
      </div>
      <div class="info-card">
        <img class="info-image" src="https://www.betterup.com/hs-fs/hubfs/Young-man-chopping-vegetables-in-the-kitchen-things-to-do-with-your-free-time.jpg?width=964&height=643&name=Young-man-chopping-vegetables-in-the-kitchen-things-to-do-with-your-free-time.jpg" alt="Save time">
        <h2>Save Time</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod dolore at provident tempora. Doloribus cumque beatae rerum? Possimus, veritatis cumque aperiam facere quidem id sunt suscipit repellat vero exercitationem tempore?</p>
      </div>
      <div class="info-card">
        <img class="info-image" src="https://www.eatingwell.com/thmb/Ch2LFPGHsQ5kySirTzPLNd0LfdA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/14-days-clean-eating-meal-plan-1200-lede-601736337d914519bb5bf8eb83540da1.jpg" alt="Eat healthily">
        <h2>Eat Healthily</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, doloribus veniam error deserunt corporis rerum libero ad. Debitis architecto eaque ab laborum. Consequatur praesentium, necessitatibus reiciendis dicta fuga id autem.</p>
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  width: 100%;
  height: 100vh; 
  margin: 0 auto;
  padding: 30px; 
}

.info-section {
  display: flex;
  justify-content: center; 
  gap: 30px; 
  flex-wrap: wrap; /* Allow wrapping if screen is small */
}

.info-card {
  width: 400px; 
  text-align: center;
}

.info-image {
  width: 100%;
  height: 250px; 
  object-fit: cover; 
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
