<template>
  <div class="container">
    <div class="title-fake">
      <h2 v-if="action == 'creating'">Novo cloud object</h2>
      <h2 v-else>Editando cloud object</h2>
    </div>
    <div v-if="error" class="section">
      <error-msg :msg="error">
        <p>Tente <a href="javascript:window.refresh();">recarregar a página.</a></p>
      </error-msg>
    </div>

    <div class="section">
      <div class="field">
        <p class="has-text-right">
          <router-link to="/cloud-objects" class="button is-small is-default">Voltar</router-link>
        </p>
      </div>
      <form action="" method='POST' @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">

        <form-control :model="form" label="Nome" name="name">
          <input type="text" class="input" name="name" @keydown="onChangeName" v-model="form.name" />
        </form-control>

        <form-control :model="form" label="Slug" name="slug">
          <input type="text" class="input" name="slug" v-model="form.slug" disabled="disabled" />
        </form-control>

        <form-control :model="form" label="Arquivo" name="object">
          <input type="file" class="input" name="object" @change="onChangeFileInput" />
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
import slugs from '../helpers/slugs'

export default {
  components: { ErrorMsg, FormControl },

  data() {
    return {
      error: null,
      action: 'creating', // can be creating or editing
      form: null,
      formData: null,
      file: null
    }
  },

  beforeRouteEnter(to, from, next) {
    if (to.params.cloudObjectId) {
      Vue.http.get(`cloud-objects/${to.params.cloudObjectId}`)
        .then(
          (response) => next(vm => vm.setData(null, response.body.data, 'editing')), 
          (error) => next(vm => vm.setData(error, null, 'editing'))
        )
    } else {
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
          this.form = new Form({slug: '', name: '', filename: '', is_active: ''});
        }
      }
    },

    onChangeName() {
      this.form.slug = slugs.slugify(this.form.name);
      this.form.errors.clear('slug');
    },

    onChangeFileInput(e) {
      e.preventDefault();
      console.log('got in here dude! ', e);
      let files = e.target.files;
      this.file = files[0];
      this.form.errors.clear('object');
    },

    onSubmit() {
      let ajaxData = new FormData(),
        formData = this.form.data();

      formData.is_active = 1;

      if (this.file) {
        console.log('[ajaxData] will append object => this.file');
        ajaxData.append('object', this.file);
      }

      if (this.action == 'editing') {
        ajaxData.append('_method', 'PUT');
      }
      
      for (let k in formData) {
        if (k != 'object') {
          ajaxData.append(k, formData[k]);
        }
      }
      
      const swalComponent = this.$swal,
        saveMethod = this.action == 'editing' ? 
          this.$http.post(`cloud-objects/${this.form.id}`, ajaxData) : 
          this.$http.post(`cloud-objects`, ajaxData);

      this.form.sendingData = true;
      saveMethod
        .then((response) => {
          this.form.onSuccess(response.body);
          const cloudObjectId = response.body.data.id;
          if (this.action == 'creating') {
            swalComponent({title: 'Sucesso!', text: 'Cloud object criado com sucesso!'});
          } else {
            swalComponent({title: 'Sucesso!', text: 'Cloud object salvo com sucesso!'})
              .then(() => window.location.reload());
          }
          console.log('The fake page id saved is: ', cloudObjectId);
        }, (err) => {
          this.form.onFail(err.body.errors);
        })
    }
  }
}
</script>