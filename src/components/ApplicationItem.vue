<template>
  <div class="columns" v-if="application">
    <div class="column is-6 name">
      <p>
        <span class="title is-bold">{{application.name}}</span>
      </p>
    </div>
    <div class="column is-2 followers has-text-centered">
      <p class="stat-val">{{ application.notifications_count }}</p>
      <p class="stat-key">notificações</p>
    </div>
    <div class="column is-2 following has-text-centered">
      <p class="stat-val">{{ application.devices_count }}</p>
      <p class="stat-key">dispositivos</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'application-item',
  props: ['model'],
  data() {
    return {
      application: this.model
    }
  }
}
</script>