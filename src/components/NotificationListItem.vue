<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ notification.title }}</p>
    </header>
    <div class="card-content">
      <div class="content">{{ notification.alert_message }}</div>
      <error-msg v-if="error" :msg="error" @close="error = ''"></error-msg>
    </div>
    <footer class="card-footer">
      <a href="javascript:void(0);" :class="btnSendState" @click="onClickSendNotification" class="card-footer-item button is-primary is-small">Enviar</a>
      <a href="javascript:void(0);" :class="btnDeleteState" @click="onClickDelete" class="card-footer-item button is-danger is-small">Excluir</a>
    </footer>
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
      this.$http.post(`applications/${this.notification.application_id}/notifications/${this.notification.id}/send`)
        .then((response) => {
          this.$emit('sent');
          this.btnSendState = '';
          this.$swal({title:'Enviado!', text: 'Notificação disparada para os dispositivos registrados!'});
        }, (err) => {
          this.error = err.body.message;
          this.btnSendState = ''
        })
    },
    onClickDelete() {
      this.$swal({
        type: 'warning', 
        title: 'Tem certeza?',
        text: 'Tem certeza que deseja apagar essa notificação?',
        showLoaderOnConfirm: true,
        showCancelButton: true
      }).then(() => {
        this.$http.delete(`applications/${this.notification.application_id}/notifications/${this.notification.id}`)
          .then((response) => {
            this.$emit('delete');
            this.$swal({type: 'success', title: 'Notificação deletada!', text: 'Notificação deletada com sucesso!'});
          }, (err) => {
            this.error = err.body.message
          })
      }, () => {})
    }
  }
}
</script>