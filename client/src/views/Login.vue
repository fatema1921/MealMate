<template>
  <div class="image-container">
    <!-- Left image -->
    <img class="side-image" src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg" alt="Left image">
    <!-- Card in the middle -->
    <div class="center">
      <h1 class="welcome-message">Welcome to our login page.</h1>
      <p class="welcome-description">Here you can login with your username and password <br> or register a new account.</p>
      <div class="card">
        <img class="card-img-top" src="https://www.instacart.com/company/wp-content/uploads/2021/10/meal-plan-paper-1050x525.jpg" alt="Card image cap">
        <div class="card-body">
          <p class="card-text">Enter your username and password to login or click register to start planning.</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <input id="inputUsername" v-model="username" placeholder="Username">
          </li>
          <li class="list-group-item">
            <input id="inputPassword" v-model="password" placeholder="Password" type="password">
          </li>
        </ul>
        <div class="card-body">
          <button id="buttonLogin" @click="login" class="btn btn-warning btn-lg" style="margin-right: 10px;">Login</button>
          <router-link to="/register" id="buttonRegister" class="btn btn-warning btn-lg">Register</router-link>
        </div>
      </div>
      <!-- Display error message if login fails -->
      <div v-if="unsuccessful" class="error-message">{{ unsuccessful }}</div>
    </div>

    <!-- Right image -->
    <img class="side-image" src="https://media.architecturaldigest.com/photos/63fe6ed58e4acf42248cafd3/16:9/w_1920,c_limit/GettyImages-1170856565.jpg" alt="Right image">
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      unsuccessful: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/users/login', {
          username: this.username,
          password: this.password
        });

        if (response.status === 200) {
          const user = response.data.user; // extracts the user object from the response data
          localStorage.setItem('userId', user._id); // Store the userId in localstorage
          alert('Login successful!');
          window.dispatchEvent(new Event('authChange')); // Send event for button to switch on navbar
          this.$router.push('/'); // Redirect to homepage
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.unsuccessful = 'Invalid password';
        } else if (error.response && error.response.status === 404) {
          this.unsuccessful = 'User not found';
        } else {
          this.unsuccessful = 'An error occurred during login';
        }
      }
    }
  }
}
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-message {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.welcome-description {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.side-image {
  width: 30%;
  height: auto;
  object-fit: cover; /* Ensures the image fills the space. cropping if necessary */
}

.card {
  max-width: 400px; /* Make sure the card doesn't get too wide */
  width: 100%; /* Full width of its container */
}

@media (max-width: 768px) {
  .image-container {
    flex-direction: column; /* Stack vertically if screen gets smaller */
    padding: 0;
  }

  .side-image {
    width: 50%; /* Make images fill the screen on small devices */
    height: auto;
    margin-bottom: 20px; /* Add spacing between the images and card */
  }
}
</style>
