<template>
  <div>
    <nav class="nav">
      <div class="nav-left">
        <a class="nav-item">
          <h1>Push Notification Service</h1>
        </a>
      </div>

      <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
      <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
      <span class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </span>

      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->
      <div class="nav-right nav-menu">
        <router-link class="nav-item" to="/">Aplicativos</router-link>
        <router-link class="nav-item" to="/users">Usuários</router-link>
        <router-link class="nav-item" v-if="!user.authenticated" to="/login">Login</router-link>
        <a class="nav-item" v-if="user.authenticated" @click="logout()">Logout</a>
      </div>
    </nav>
    <nprogress-container></nprogress-container>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import NprogressContainer from '../../node_modules/vue-nprogress/src/NprogressContainer.vue'

export default {
  name: 'app',
  components: {NprogressContainer},
  data () {
    return {
      user: auth.user
    }
  },

  methods: {
    logout() {
      auth.logout()
    }
  }
}
</script>

<style lang="sass">
  @import '../../node_modules/bulma/bulma.sass';
  .nprogress-container {
    width: 100%; height: 30px;
  }
</style>
