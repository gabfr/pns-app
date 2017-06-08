<template>
  <section class="hero is-fullheight is-dark is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h2 class="title">
              Login
            </h2>
            <form action="" method="post" @submit.prevent="submit">
              <div class="box">
                <error-msg v-if="error" :msg="error" @close="error = ''"></error-msg>
                <label class="label">E-mail</label>
                <p class="control">
                  <input class="input" type="text" v-model="credentials.email" placeholder="seu@email.com">
                </p>
                <label class="label">Senha</label>
                <p class="control">
                  <input class="input" type="password" v-model="credentials.password" placeholder="●●●●●●●">
                </p>
                <hr>
                <p class="control">
                  <button class="button is-primary">Entrar</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import auth from '../auth'
import ErrorMsg from '../components/ErrorMsg.vue'

export default {
  components: {
    ErrorMsg
  },

  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: ''
    }
  },

  methods: {
    submit() {
      var credentials = {
        email: this.credentials.email,
        password: this.credentials.password
      }
      auth.login(this, credentials, '/')
    },
    dismissErrors() {
      this.error = '';
    }
  }

}

</script>