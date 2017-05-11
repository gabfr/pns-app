<template>
  <div class="box">
    <article class="media">
      <div class="content">
        <div class="columns">
          <div class="column is-12" v-if="error">
            <error-msg :msg="error" @close="error = ''"></error-msg>
          </div>
          <div class="column is-8">
            <p><strong>{{notification.title}}</strong></p>
            <p>{{notification.alert_message}}</p>
          </div>
          <div class="column is-4">
            <a class="button is-success" :class="btnSendState" @click="onClickSendNotification">Enviar</a>
            <a class="button is-danger" :class="btnDeleteState" @click="onClickDelete">Excluir</a>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import configs from '../configs'
import ErrorMsg from './ErrorMsg.vue'

export default {
  name: 'notification-list-item',
  props: ['model'],
  components: {ErrorMsg},
  data() {
    return {
      notification: this.model,
      error: null,
      btnSendState: '',
      btnDeleteState: ''
    }
  },

  methods: {
    onClickSendNotification() {
      this.btnSendState = 'is-loading';
      this.$http.post(`${configs.API_URL}/applications/${this.notification.application_id}/notifications/${this.notification.id}/send`)
        .then((response) => {
          this.$emit('sent');
          this.btnSendState = '';
        }, (err) => {
          this.error = err.body.message;
          this.btnSendState = ''
        })
    },
    onClickDelete() {
      this.btnDeleteState = 'is-loading';
      this.$http.delete(`${configs.API_URL}/applications/${this.notification.application_id}/notifications/${this.notification.id}`)
        .then((response) => {
          this.$emit('delete');
          this.btnDeleteState = ''
        }, (err) => {
          this.error = err.body.message
          this.btnDeleteState = ''
        })
    }
  }
}
</script>