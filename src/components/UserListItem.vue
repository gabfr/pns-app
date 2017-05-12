<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ user.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">{{ user.email }}</div>
      <error-msg v-if="error" :msg="error" @close="error = ''"></error-msg>
    </div>
    <footer class="card-footer">
      <router-link class="card-footer-item" :to="'/users/' + user.id">Editar</router-link>
      <a href="javascript:void(0);" @click="onClickDelete" class="card-footer-item">Excluir</a>
    </footer>
  </div>
</template>

<script>
import configs from '../configs'
import ErrorMsg from './ErrorMsg.vue'

export default {
  name: 'user-list-item',
  props: ['model'],
  components: {ErrorMsg},
  data() {
    return {
      user: this.model,
      error: null
    }
  },

  methods: {
    onClickDelete() {
      this.$swal({
        type: 'warning', 
        title: 'Tem certeza?',
        text: 'Tem certeza que deseja apagar esse usuário?',
        showLoaderOnConfirm: true,
        showCancelButton: true
      }).then(() => {
        this.$http.delete(`users/${this.user.id}`)
          .then((response) => {
            this.$emit('delete');
            this.$swal({type: 'success', title: 'Usuário deletado!', text: 'Usuário deletado com sucesso!'});
          }, (err) => {
            this.error = err.body.message
          })
      })
    }
  }
}
</script>