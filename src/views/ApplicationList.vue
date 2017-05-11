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

export default {
  components: { ApplicationListItem },

  data() {
    return {
      applications: {meta: null, data: null}
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get(configs.API_URL + 'applications').then((response) => {
      console.log('Applications loaded: ', response);
      next(vm => vm.setData(null, response.body));
    }, (error) => {
      console.log('Error trying to load applications: ', error);
      next(vm => vm.setData(error, null));
    })
  },

  methods: {
    setData(err, applications) {
      if (err)
        this.error = err;
      else
        this.applications = applications;
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>