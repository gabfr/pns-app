<template>
  <div class="field is-danger">
    <label class="label">{{ label }}</label>
    <p class="control"><slot :class="{ 'is-danger': form.errors.has(name) }"></slot></p>
    <p class="help is-danger" v-if="form.errors.has(name)" v-text="form.errors.get(name)"></p>
  </div>
</template>

<script>
export default {
  name: 'form-control',
  props: ['model', 'label', 'name'],

  data() {
    return {
      form: this.model
    }
  }
}
</script>