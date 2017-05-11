<template>
  <div class="container">

    <div class="section">
      <error-msg v-if="app.error" :msg="app.error"><p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p></error-msg>
      
      <application-item :model="app.data"></application-item>

      <notification-list-item v-for="notification in app.notifications.data" :model="notification" @delete="alert('removed')"></notification-list-item>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import configs from '../configs'
import ApplicationItem from '../components/ApplicationItem.vue'
import NotificationListItem from '../components/NotificationListItem.vue'
import Vue from 'vue'

export default {
  components: { ApplicationItem, NotificationListItem },

  data() {
    return {
      app: {
        error: null,
        data: null,
        notifications: {meta: null, data: null}
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    let applicationSlug = to.params.applicationSlug;
    Vue.http.get(`${configs.API_URL}applications/${applicationSlug}`).then((response) => {
      let application = response.body.data;
      Vue.http.get(`${configs.API_URL}applications/${applicationSlug}/notifications`).then((response) => {
        let notifications = response.body;
        next(vm => vm.setData(null, application, notifications));
      }, (error) => {
        next(vm => vm.setData(error, application, null))
      })
    }, (error) => {
      next(vm => vm.setData(error, null, null));
    })
  },

  methods: {
    setData(err, application, notifications) {
      if (err)
        this.error = err;
      else {
        this.app.data = application;
        this.app.notifications.data = notifications.data;
        this.app.notifications.meta = notifications.meta;
      }
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>