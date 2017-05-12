<template>
  <div class="container">

    <div class="section">
      <error-msg v-if="app.error" :msg="app.error"><p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p></error-msg>
      
      <application-item :model="app.data"></application-item>

      <div class="level">
        <div class="level-left"><h2>Notificações</h2></div>
        <div class="level-right">
          <router-link :to="'/applications/' + app.data.slug + '/new-notification'" class="button is-small is-primary">
            Criar notificação
          </router-link>
        </div>
      </div>

      <notification-list-item v-for="notification in app.notifications.data" :model="notification" @delete="removeFromNotificationList(notification)"></notification-list-item>
      
    </div>
  </div>
</template>

<script>
import auth from '../auth'
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
    Vue.http.get(`applications/${applicationSlug}`).then((response) => {
      let application = response.body.data;
      Vue.http.get(`applications/${applicationSlug}/notifications`).then((response) => {
        let notifications = response.body;
        next(vm => vm.setApplicationData(null, application, notifications));
      }, (error) => {
        next(vm => vm.setApplicationData(error, application, null))
      })
    }, (error) => {
      next(vm => vm.setApplicationData(error, null, null));
    })
  },

  methods: {
    setApplicationData(err, application, notifications) {
      if (err)
        this.error = err;
      else {
        this.app.data = application;
        this.app.notifications.data = notifications.data;
        this.app.notifications.meta = notifications.meta;
      }
    },
    removeFromNotificationList(notification) {
      const index = this.app.notifications.data.indexOf(notification);
      if (index !== 1)
        this.app.notifications.data.splice(index, 1);
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>