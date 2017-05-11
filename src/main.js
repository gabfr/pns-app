import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import auth from './auth'
import App from './views/App.vue'
import ApplicationList from './views/ApplicationList.vue'
import ApplicationDashboard from './views/ApplicationDashboard.vue'
//import Signup from './components/Signup.vue'
import Login from './views/Login.vue'

Vue.use(VueResource)
Vue.use(VueRouter)

auth.checkAuth()

if (auth.user.authenticated)
	Vue.http.headers.common['Authorization'] = auth.getAuthHeader(false);

const routes = [
	{ path: '/', component: ApplicationList },
	{ path: '/applications', component: ApplicationList },
	{ path: '/applications/:applicationSlug', component: ApplicationDashboard },
	{ path: '/login', component: Login }
]

export var router = new VueRouter({
	routes
})

const app = new Vue({
	router,
	components: { App }
}).$mount('#app');
