<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ fakePage.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">{{ fakePage.content_url }}</div>
      <error-msg v-if="error" :msg="error" @close="error = ''"></error-msg>
    </div>
    <footer class="card-footer">
      <router-link :to="'/fake-pages/' + fakePage.id" class="card-footer-item button">Editar</router-link>
      <a href="javascript:void(0);" :class="btnDeleteState" @click="onClickDelete" class="card-footer-item button is-danger">Excluir</a>
    </footer>
  </div>
</template>

<script>
import configs from '../configs'
import ErrorMsg from './ErrorMsg.vue'

export default {
  name: 'fake-page-list-item',
  props: ['model'],
  components: {ErrorMsg},
  data() {
    return {
      fakePage: this.model,
      error: null,
      btnSendState: '',
      btnDeleteState: ''
    }
  },

  methods: {
    onClickDelete() {
      this.$swal({
        type: 'warning', 
        title: 'Tem certeza?',
        text: 'Tem certeza que deseja apagar essa fake page?',
        showLoaderOnConfirm: true,
        showCancelButton: true
      }).then(() => {
        this.$http.delete(`fake-pages/${this.fakePage.id}`)
          .then((response) => {
            this.$emit('delete');
            this.$swal({type: 'success', title: 'Fake page deletada!', text: 'Fake page deletada com sucesso!'});
          }, (err) => {
            this.error = err.body.message
          })
      }, () => {})
    }
  }
}
</script>