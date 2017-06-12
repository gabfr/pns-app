<template>
  <div class="container">
    <div class="level">
      <div class="level-left"><h2>Fake pages</h2></div>
      <div class="level-right"><router-link to="/fake-pages/new" class="button is-primary">Criar fake page</router-link></div>
    </div>
    <div class="section">
      <fake-page-list-item v-for="(fakePage, key, index) in fakePages.data" :key="fakePage.id" :model="fakePage" @delete="fakePages.data.splice(key, 1)"></fake-page-list-item>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import FakePageListItem from '../components/FakePageListItem.vue'
import Vue from 'vue'
import {router} from '../main.js'

export default {
  components: { FakePageListItem },

  data() {
    return {
      fakePages: {meta: null, data: []}
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get('fake-pages')
      .then(
        (response) => next(vm => vm.setData(null, response.body)), 
        (error) => next(vm => vm.setData(error, null))
      )
  },

  methods: {
    checkAccess() {
      if (!auth.user.authenticated) {
        router.push('/login')
      }
    },
    setData(err, fakePages) {
      this.checkAccess();
      if (err)
        this.error = err;
      else
        this.fakePages = fakePages;
    }
  }
}
</script>