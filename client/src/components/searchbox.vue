<template>
  <b-form-input
    class="search-box"
    v-model="internalValue"
    @input="updateQuery"
    placeholder="Type to search for a recipe..."
  ></b-form-input>
</template>

<script>
export default {
  name: 'Searchbox',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      internalValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.internalValue = newValue
    }
  },
  methods: {
    updateQuery() {
      console.log('Emitting input:', this.internalValue) // Log emitted value
      this.$emit('input', this.internalValue)
    }
  }
}
</script>

<style scoped>
.search-box {
  margin-top: 1em;
  max-width: 400px; /* Adjust width as needed */
  margin-left: auto;
  margin-right: auto;
}
</style>
