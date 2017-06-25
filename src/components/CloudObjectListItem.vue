<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ cloudObject.name }}</p>
    </header>
    <div class="card-content">
      <div class="content"><img :src="cloudObject.download_url" alt=""></div>
      <error-msg v-if="error" :msg="error" @close="error = ''"></error-msg>
    </div>
    <footer class="card-footer">
      <router-link :to="'/cloud-objects/' + cloudObject.id" class="card-footer-item button">Editar</router-link>
      <a href="javascript:void(0);" :class="btnDeleteState" @click="onClickDelete" class="card-footer-item button is-danger">Excluir</a>
    </footer>
  </div>
</template>

<script>
import configs from '../configs'
import ErrorMsg from './ErrorMsg.vue'

export default {
  name: 'cloud-object-list-item',
  props: ['model'],
  components: {ErrorMsg},
  data() {
    return {
      cloudObject: this.model,
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
        text: 'Tem certeza que deseja apagar esse cloud object?',
        preConfirm: () => {
          return this.$http.delete(`cloud-objects/${this.cloudObject.id}`)
            .then((response) => {return 1;}, (err) => {
              this.error = err.body.message;
              return -1;
            })
        },
        showLoaderOnConfirm: true,
        showCancelButton: true
      }).then(() => {
        this.$emit('delete');
        this.$swal({type: 'success', title: 'Cloud object deletado!', text: 'Cloud object deletado com sucesso!'});
      }, () => {})
    }
  }
}
</script>