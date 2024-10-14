<template>
  <div class="center">
    <h1 class="welcome-message">Create a new account</h1>
    <p class="welcome-description">Fill in the details below to register:</p>
    <div class="card">
      <img class="card-img-top" src="https://www.instacart.com/company/wp-content/uploads/2021/10/meal-plan-paper-1050x525.jpg" alt="Card image cap">
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <input id="inputName" v-model='name' placeholder="Name" />
          </li>
          <li class="list-group-item">
            <input id="inputUsername" v-model='username' placeholder="Username" />
          </li>
          <li class="list-group-item">
            <input id="inputPassword" type="password" v-model='password' placeholder="Password" />
          </li>
          <li class="list-group-item">
            <input id="inputConfirmPassword" type="password" v-model='confirmPassword' placeholder="Confirm Password" />
          </li>
          <li class="list-group-item">
            <select v-model="meal_category">
              <option disabled value="">Select Meal Category</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Gluten-free">Gluten-free</option>
              <option value="High-protein">High-protein</option>
            </select>
          </li>
          <li class="list-group-item">
            <input id="inputPreferences" v-model='preferences' placeholder="Preferences (optional)" />
          </li>
        </ul>
        <div class="card-body">
          <button id="buttonRegister" @click="register" class="btn btn-warning btn-lg">Register</button>
          <router-link to="/login" class="btn btn-secondary btn-lg" style="margin-left: 10px;">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      meal_category: '',
      preferences: '',
      registrationError: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.registrationError = "Passwords do not match!";
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/users', {
          name: this.name,
          username: this.username,
          password: this.password,
          meal_category: this.meal_category,
          preferences: this.preferences
        });
        console.log('Registration successful:', response);
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration error:', error);
        this.registrationError = "Registration failed. Try again.";
      }
    }
  }
};
</script>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  max-width: 400px; /* Set max width to prevent the card from becoming too large */
  width: 100%;
}

.card-img-top {
  max-width: 100%;
  height: auto; /* Automatically adjust the height based on width */
  object-fit: cover; /* Make the image fit the card width without stretching */
}

.list-group-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-message {
  font-size: 2rem;
  font-weight: bold;
}

.welcome-description {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>
