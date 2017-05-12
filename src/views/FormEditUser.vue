<template>
  <div class="container">
    <h2>Editar {{form.name}}</h2>
    <div v-if="error" class="section">
      <error-msg :msg="error">
        <p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p>
      </error-msg>
    </div>

    <div class="section">
      <div class="field">
        <p class="has-text-right">
          <router-link to="/users" class="button is-small is-default">Voltar</router-link>
        </p>
      </div>
      <form action="" method='POST' @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">

        <form-control :model="form" label="Nome" name="name">
          <input type="text" class="input" name="name" v-model="form.name" />
        </form-control>

        <form-control :model="form" label="E-mail" name="email">
          <input type="email" class="input" name="email" v-model="form.email" />
        </form-control>

        <form-control :model="form" label="Senha" name="password">
          <input type="password" class="input" name="password" v-model="form.password" />
        </form-control>

        <form-control :model="form" label="Confirme sua senha" name="confirm_password">
          <input type="password" class="input" name="confirm_password" v-model="form.confirm_password" />
        </form-control>

        <form-control :model="form" label="Tipo de usuário" name="is_super">
          <select name="is_super" class="select" v-model="form.is_super" @change="form.errors.clear($event.target.name)">
            <option value="">Selecione um tipo</option>
            <option value="1">Super usuário</option>
            <option value="0">Padrão</option>
          </select>
        </form-control>

        <div class="control">
          <button class="button is-primary" :class="{ 'is-loading': form.isLoading() }" :disabled="form.errors.any()">Editar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import auth from '../auth'
import ErrorMsg from '../components/ErrorMsg.vue'
import FormControl from '../components/FormControl.vue'
import Form from '../helpers/form'

export default {
  components: { ErrorMsg, FormControl },

  data() {
    return {
      error: null,
      form: new Form({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
      })
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get(`users/${to.params.userId}`)
      .then(
        (response) => next(vm => vm.setUserData(null, response.body.data)), 
        (error) => next(vm => vm.setUserData(error, null))
      )
  },

  methods: {
    setUserData(err, user) {
      if (err)
        this.error = err;
      else {
        this.form.resetData(user);
        this.form.is_super = this.form.is_super === true ? "1" : "0";
      }
    },
    onSubmit() {
      const swalComponent = this.$swal;

      if (!this.validatePasswordConfirmation()) {
        this.form.errors.record({confirm_password: ["As senhas não conferem!"]});
        return;
      }

      this.form.put(`users/${this.form.originalData.id}`)
        .then((response) => {
          swalComponent({title: 'Sucesso!', text: 'Usuário editado com sucesso!'});
          this.setUserData(null, response.data);
        })
    },
    validatePasswordConfirmation() {
      return this.form.password === this.form.confirm_password;
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>