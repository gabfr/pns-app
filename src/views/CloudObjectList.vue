<template>
  <div class="container">
    <div class="level">
      <div class="level-left"><h2>Cloud Objects</h2></div>
      <div class="level-right"><router-link to="/cloud-objects/new" class="button is-primary">Criar cloud object</router-link></div>
    </div>
    <div class="section">
      <cloud-object-list-item v-for="(cloudObject, key, index) in cloudObjects.data" :key="cloudObject.id" :model="cloudObject" @delete="cloudObjects.data.splice(key, 1)"></cloud-object-list-item>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import CloudObjectListItem from '../components/CloudObjectListItem.vue'
import Vue from 'vue'
import {router} from '../main.js'

export default {
  components: { CloudObjectListItem },

  data() {
    return {
      cloudObjects: {meta: null, data: []}
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get('cloud-objects')
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
    setData(err, cloudObjects) {
      this.checkAccess();
      if (err)
        this.error = err;
      else
        this.cloudObjects = cloudObjects;
    }
  }
}
</script>