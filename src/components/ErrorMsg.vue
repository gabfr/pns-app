<template>
  <div class="notification is-danger">
    <button class="delete" @click.prevent="close()"></button>
    <p>{{ error }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'error-msg',
  props: ['msg'],

  methods: {
    close() {
      this.$emit('close')
    }
  },

  data() {
    return {
      error: this.msg
    }
  }
}
</script>