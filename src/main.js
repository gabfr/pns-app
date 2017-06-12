import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import VueSweetAlert from 'vue-sweetalert'
import NProgress from 'vue-nprogress'

import auth from './auth'
import configs from './configs'
import App from './views/App.vue'
import ApplicationList from './views/ApplicationList.vue'
import ApplicationDashboard from './views/ApplicationDashboard.vue'
import FormNewNotification from './views/FormNewNotification.vue'
import UserList from './views/UserList.vue'
import FormEditUser from './views/FormEditUser.vue'
import FormNewUser from './views/FormNewUser.vue'
import FakePageList from './views/FakePageList.vue'
import FormFakePage from './views/FormFakePage.vue'
//import Signup from './components/Signup.vue'
import Login from './views/Login.vue'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueSweetAlert)
Vue.use(NProgress, {
	latencyThreshold: 200,
	router: true,
	http: false
})

const nprogress = new NProgress({ parent: '.nprogress-container' })

auth.checkAuth()

Vue.http.options.root = configs.API_URL;
if (auth.user.authenticated)
	Vue.http.headers.common['Authorization'] = auth.getAuthHeader(false);

const routes = [
	{ path: '/', component: ApplicationList },
	{ path: '/applications', component: ApplicationList },
	{ path: '/applications/:applicationSlug/new-notification', component: FormNewNotification },
	{ path: '/applications/:applicationSlug', component: ApplicationDashboard },
	{ path: '/users', component: UserList },
	{ path: '/users/new', component: FormNewUser },
	{ path: '/users/:userId', component: FormEditUser },
	{ path: '/fake-pages', component: FakePageList },
	{ path: '/fake-pages/new', component: FormFakePage },
	{ path: '/fake-pages/:fakePageId', component: FormFakePage },
	{ path: '/login', component: Login }
]

export var router = new VueRouter({
	routes
})

const app = new Vue({
	router,
	nprogress,
	components: { App }
}).$mount('#app');
