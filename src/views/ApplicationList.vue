<template>
  <div class="container">

    <div class="section">
      <application-list-item v-for="application in applications.data" :key="application.id" :model="application"></application-list-item>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import configs from '../configs'
import ApplicationListItem from '../components/ApplicationListItem.vue'
import Vue from 'vue'
import {router} from '../main.js'

export default {
  components: { ApplicationListItem },

  data() {
    return {
      applications: {meta: null, data: null}
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get('applications').then((response) => {
      console.log('Applications loaded: ', response);
      next(vm => vm.setData(null, response.body));
    }, (error) => {
      console.log('Error trying to load applications: ', error);
      next(vm => vm.setData(error, null));
    })
  },

  methods: {
    checkAccess() {
      if (!auth.user.authenticated) {
        router.push('login')
      }
    },
    setData(err, applications) {
      this.checkAccess();
      if (err)
        this.error = err;
      else
        this.applications = applications;
    }
  },
}
</script>