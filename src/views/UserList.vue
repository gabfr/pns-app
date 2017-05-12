<template>
  <div class="container">
    <div class="level">
      <div class="level-left"><h2>Usuários</h2></div>
      <div class="level-right"><router-link to="/users/new" class="button is-primary">Criar usuário</router-link></div>
    </div>
    <div class="section">
      <user-list-item v-for="user in users.data" :key="user.id" :model="user"></user-list-item>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import UserListItem from '../components/UserListItem.vue'
import Vue from 'vue'

export default {
  components: { UserListItem },

  data() {
    return {
      users: {meta: null, data: []}
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get('users')
      .then(
        (response) => next(vm => vm.setData(null, response.body)), 
        (error) => next(vm => vm.setData(error, null))
      )
  },

  methods: {
    setData(err, users) {
      if (err)
        this.error = err;
      else
        this.users = users;
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>