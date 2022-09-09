/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'

require('./bootstrap');

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)

// VeeValidate
import VeeValidate, { Validator } from 'vee-validate'
import es from './vee-locale/es_custom.js'
Vue.use(VeeValidate);
Validator.localize('es', es);


// axios
import axios from './axios.js'
Vue.prototype.$http = axios

// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// Vuexy Admin Filters
import './filters/filters'


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css');

// mixins
import notifsHelper from "./components/mixins/notificationsHelper";
import dateHelper from "./components/mixins/dateHelper";
import alerts from "./components/mixins/alerts";
Vue.mixin(notifsHelper);
Vue.mixin(dateHelper);
Vue.mixin(alerts);



// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';


Vue.config.productionTip = false;
Vue.prototype.$isLoading = false;

import {mapState, mapMutations, mapActions} from "vuex";

import interceptors from "./helpers/interceptors.js";
interceptors();

// SignalR - Socket para nuevos pedidos.
import VueSignalR from '@latelier/vue-signalr'

Vue.use(VueSignalR, `http://auxiliar96-001-site1.gtempurl.com/DrinkGoHub`)

Vue.mixin({
  data: function() {
    return {
      //todo
    }
  },
  created() {
    // cargar el access token en axios desde vuex (sessionStorage)
    const user = store.getters["auth/getUser"];
    if(user){
      this.setAxiosAccessToken(user.accessToken);
    }
  },
  computed: {
    ApiRoute() {
      return process.env.VUE_APP_API_DOMAIN
    },
  },
  watch: {
    async '$store.state.isUnauthenticated'(val){
      if(!val){
        return;
      }
      this.executeAppLogout();
    }
  },
  methods: {
    ...mapActions('auth', ['apiLogoutRequest']),
    ...mapMutations('auth', ['cleanSession']),
    ...mapState("auth", ["access_token"]),
    showLoading(show, text= null){
      this.$isLoading = show;
      if(show === true){
        if(text != null){
          this.$vs.loading({text: text});
        }
        else {
          this.$vs.loading();
        }
      }
      else {
        this.$vs.loading.close();
      }
    },
    async executeAppLogout(){
      await this.apiLogoutRequest(this.access_token);
      this.cleanSession();
      this.showLoading(false);
      sessionStorage.clear();
      window.location = "/login";
    },
    showFullPageLoader(){
      const appLoading = document.getElementById('loading-bg');
      const m_app = document.getElementById('app');
      appLoading.style.display = 'block';
      m_app.style.display = 'none';
    },
    setAxiosAccessToken(token){
      window.axios.defaults.headers.common['token'] = token;
    },
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
