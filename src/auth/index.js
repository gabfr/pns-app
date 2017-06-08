import {router} from '../main.js'
import Vue from 'vue'

// URL and endpoint constants

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
    context.$http.post('access-token', creds).then((response) => {
      localStorage.setItem('access_token', response.body)

      this.user.authenticated = true

      Vue.http.headers.common['Authorization'] = this.getAuthHeader(false);

      // Redirect to a specified route
      if(redirect) {
        router.push(redirect)
      }

    },
    (err) => {
      context.error = err.body.message
    })
  },

  signup(context, creds, redirect) {
    context.$http.post('users', creds, (data) => {
      localStorage.setItem('access_token', data.access_token)

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)        
      }

    }).error((err) => {
      context.error = err
    })
  },

  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('access_token');
    this.user.authenticated = false;
    Vue.http.headers.common['Authorization'] = '';
  },

  checkAuth() {
    var jwt = localStorage.getItem('access_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false      
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader(returnObject = true) {
    if (returnObject)
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    else
      return 'Bearer ' + localStorage.getItem('access_token')
  }
}