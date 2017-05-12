<template>
  <div class="container">

    <div class="section">
      <error-msg v-if="app.error" :msg="app.error">
        <p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p>
      </error-msg>
      <application-item :model="app.data"></application-item>
    </div>

    <div class="section">
      <div class="field">
        <p class="has-text-right">
          <router-link :to="'/applications/' + app.data.slug" class="button is-small is-default">Voltar para {{ app.data.name }}</router-link>
        </p>
      </div>
      <form action="" method='POST' @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">

        <form-control :model="form" label="Título" name="title">
          <input type="text" class="input" name="title" v-model="form.title" />
        </form-control>

        <form-control :model="form" label="Mensagem" name="alert_message">
          <input type="text" class="input" name="alert_message" v-model="form.alert_message" />
        </form-control>

        <form-control :model="form" label="Ícone" name="icon">
          <select name="icon" class="select" v-model="form.icon" @change="form.errors.clear($event.target.name)">
            <option value="">Selecione um ícone</option>
            <option value="default">Padrão</option>
          </select>
        </form-control>

        <form-control :model="form" label="URL" name="url">
          <input type="text" class="input" name="url" v-model="form.url" />
        </form-control>

        <div class="control">
          <button class="button is-primary" :class="{ 'is-loading': form.isLoading() }" :disabled="form.errors.any()">Criar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import auth from '../auth'
import ApplicationItem from '../components/ApplicationItem.vue'
import ErrorMsg from '../components/ErrorMsg.vue'
import FormControl from '../components/FormControl.vue'
import Form from '../helpers/form'

export default {
  components: { ApplicationItem, ErrorMsg, FormControl },

  data() {
    return {
      app: {
        error: null,
        data: null
      },
      form: new Form({
        title: '',
        alert_message: '',
        icon: '',
        url: ''
      })
    }
  },

  beforeRouteEnter(to, from, next) {
    Vue.http.get(`applications/${to.params.applicationSlug}`)
      .then(
        (response) => next(vm => vm.setApplicationData(null, response.body.data)), 
        (error) => next(vm => vm.setApplicationData(error, null))
      )
  },

  methods: {
    setApplicationData(err, application) {
      if (err)
        this.error = err;
      else 
        this.app.data = application;
    },
    onSubmit() {
      const redirectTo = this.$router.go;
      const appSlug = this.app.data.slug;
      const swalComponent = this.$swal;

      this.form.post(`applications/${this.app.data.slug}/notifications`)
        .then(response => {
          swalComponent({title: 'Sucesso!', text: 'Notificação criada com sucesso!'})
            .then(() => redirectTo(`/applications/${appSlug}`))
        })
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }
}
</script>