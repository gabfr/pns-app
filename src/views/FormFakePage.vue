<template>
  <div class="container">
    <div class="title-fake">
      <h2 v-if="action == 'creating'">Nova fake page</h2>
      <h2 v-else>Editando fake page</h2>
    </div>
    <div v-if="error" class="section">
      <error-msg :msg="error">
        <p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p>
      </error-msg>
    </div>

    <div class="section">
      <div class="field">
        <p class="has-text-right">
          <router-link to="/fake-pages" class="button is-small is-default">Voltar</router-link>
        </p>
      </div>
      <form action="" method='POST' @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">

        <form-control :model="form" label="Nome" name="name">
          <input type="text" class="input" name="name" v-model="form.name" />
        </form-control>

        <form-control :model="form" label="URL da página" name="content_url">
          <input type="text" class="input" name="content_url" v-model="form.content_url" />
        </form-control>

        <form-control :model="form" label="Menu ativo" name="is_active">
          <label class="checkbox">
            <input type="checkbox" name="is_active" v-model="form.is_active" @click="form.errors.clear($event.target.name)" />
            Ativo
          </label>
        </form-control>

        <div class="control">
          <button class="button is-primary" :class="{ 'is-loading': form.isLoading() }" :disabled="form.errors.any()">Salvar</button>
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
      action: 'creating', // can be creating or editing
      form: null
    }
  },

  beforeRouteEnter(to, from, next) {
    if (to.params.fakePageId) {
    console.log('IM ENTERING HERE1')
      Vue.http.get(`fake-pages/${to.params.fakePageId}`)
        .then(
          (response) => next(vm => vm.setData(null, response.body.data, 'editing')), 
          (error) => next(vm => vm.setData(error, null, 'editing'))
        )
    } else {
    console.log('IM ENTERING HERE2')
      next(vm => vm.setData(null, null, 'creating'));
    }
  },

  methods: {
    setData(err, fakePage, action) {
      if (err) {
        this.error = err.body.message;
      } else {
        this.action = action;
        if (this.action == 'editing') {
          this.form = new Form(fakePage);
        } else {
          this.form = new Form({name: '', content_url: '', is_active: ''});
        }
      }
    },

    onSubmit() {
      const swalComponent = this.$swal,
        saveMethod = this.action == 'editing' ? 
          this.form.put(`fake-pages/${this.form.id}`) : 
          this.form.post(`fake-pages`);

      saveMethod
        .then((response) => {
          const fakePageId = response.data.id;
          if (this.action == 'creating') {
            swalComponent({title: 'Sucesso!', text: 'Fake page criada com sucesso!'});
          } else {
            swalComponent({title: 'Sucesso!', text: 'Fake page salva com sucesso!'})
              .then(() => window.location.reload());
          }
          console.log('The fake page id saved is: ', fakePageId);
        })
    }
  }
}
</script>