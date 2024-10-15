<template>
  <div class="user-profile">
    <div v-if="editMode" class="edit-profile">
      <h1>Edit Profile</h1>
      
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" class="form-control" v-model="user.name" />
        </div>

        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" class="form-control" v-model="user.username" />
        </div>

        <div class="form-group">
          <label for="meal_category">Meal Category:</label>
          <input type="text" class="form-control" v-model="user.meal_category" />
        </div>

        <div class="form-group">
          <label for="preferences">Preferences:</label>
          <textarea class="form-control" v-model="user.preferences"></textarea>
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" class="form-control" v-model="user.password" />
        </div>

        <button type="submit" class="btn btn-primary">Save Profile</button>
        <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
      </form>
    </div>

    <div v-else>
      <div class="profile-header">
        <img src="https://static.thenounproject.com/png/5034901-200.png" alt="User Avatar" class="avatar" />
        <h1>{{ user.name }}</h1>
      </div>

      <div class="profile-info">
        <h2>Profile Information</h2>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Meal Category:</strong> {{ user.meal_category }}</p>
        <p><strong>Preferences:</strong> {{ user.preferences }}</p>
      </div>

      <div class="profile-actions">
        <button class="btn btn-warning" @click="editProfile">Edit Profile</button>
        <button class="btn btn-danger" @click="deleteProfile">Delete Profile</button>
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
      userID: "",
    };
  },
  methods: {
    // Fetch user profile information
    async fetchUserProfile() {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${this.userID}`);
        this.user = response.data;
      } catch (error) {
        this.message = 'Error fetching profile';
      }
    },

    editProfile() {
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
          await axios.patch(`http://localhost:3000/api/users/${this.userID}`, this.user);
          this.message = 'Profile updated successfully (PATCH)!';
        } else {
          await axios.put(`http://localhost:3000/api/users/${this.userID}`, this.user);
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
          await axios.delete(`http://localhost:3000/api/users/${this.userID}`);
          this.message = 'Profile deleted successfully';
          // Redirect to a login after deletion
          this.$router.push('/login');
        } catch (error) {
          this.message = `Error deleting profile: ${error.message}`;
        }
      }
    },
  },
  mounted() {
    this.userID = localStorage.getItem('userId'); 
    console.log('Retrieved user ID:', this.userID); // Check what is retrieved
    if (this.userID) {
      this.fetchUserProfile(); 
    } else {
      console.log('No user ID found in local storage. Make sure to be logged in.');
    }
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

.message {
  margin-top: 20px;
  color: green;
}
</style>
