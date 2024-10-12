<template>
  <div class="user-profile">
    <div v-if="editMode" class="edit-profile">
      <h1>Edit profile</h1>
      
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" v-model="user.name" />
        </div>

        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="user.username" />
        </div>

        <div class="form-group">
          <label for="meal_category">Meal Category:</label>
          <input type="text" v-model="user.meal_category" />
        </div>

        <div class="form-group">
          <label for="preferences">Preferences:</label>
          <textarea v-model="user.preferences"></textarea>
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="user.password" />
        </div>

        <button type="submit">Save Profile</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>

    <div v-else>
    <div class="profile-header">
      <img src= https://static.thenounproject.com/png/5034901-200.png alt="User Avatar" class="avatar" />
      <h1>{{ user.name }}</h1>
    </div>

    <div class="profile-info">
      <h2>Profile Information</h2>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Meal Category:</strong> {{ user.meal_category }}</p>
      <p><strong>Preferences:</strong> {{ user.preferences }}</p>
    </div>

    <div class="profile-actions">
      <button @click="editProfile">Edit Profile</button>
      <button @click="deleteProfile" class="delete-button">Delete Profile</button>
      <button @click="logOut">Log Out</button>
    </div>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {
        name: '',
        username: '',
        meal_category: '',
        preferences: '',
      },
      message: '',
      editMode: false,
      username: "Fatma123" // hardcoded user, fix later using localstorage?
    };
  },
  methods: {
    // Fetch user profile information
    async fetchUserProfile() {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${this.username}`);
        this.user = response.data;
      } catch (error) {
        this.message = 'Error fetching profile';
      }
    },

    editProfile(){
      this.editMode = true;
    },

    // Cancel editing
    cancelEdit() {
      this.editMode = false;
      this.fetchUserProfile(); // Reset data to avoid unsaved changes
    },



    async saveChanges() {
      try {
        if (!this.user.password) {
          await axios.patch(`http://localhost:3000/api/users/${this.username}`, this.user);
          this.message = 'Profile updated successfully (PATCH)!';
        } else {
          await axios.put(`http://localhost:3000/api/users/${this.username}`, this.user);
          this.message = 'Profile updated successfully (PUT)!';
        }

        this.editMode = false;
        this.fetchUserProfile();
      
      } catch (error) {
        this.message = `Error updating profile: ${error.message}`;
      }
    },

    // Delete user profile
    async deleteProfile() {
      if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${this.username}`);
          this.message = 'Profile deleted successfully';
          // Redirect to a login after deletion
          this.$router.push('/login');
        } catch (error) {
          this.message = `Error deleting profile: ${error.message}`;
        }
      }
    },

    logOut() {
      // Redirect to login page
      this.$router.push('/login');
    }
  },
  mounted() {
    //this.username = this.$route.params.username;
    this.fetchUserProfile();
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  margin-bottom: 20px;
}

.avatar {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.profile-info {
  text-align: left;
}

.profile-info h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
  color: #333;
}

.profile-info p {
  margin-bottom: 8px;
}

.profile-actions {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #007bff;
  color: #fff;
}

.delete-button {
  background-color: red;
}

.delete-button:hover {
  background-color: darkred;
}

.message {
  margin-top: 20px;
  color: green;
}
</style>
