import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCroppie from 'vue-croppie';
import router from './routes'
import firebase from 'firebase/app';
import 'croppie/croppie.css'
import 'firebase/auth'
import './components/firebaseInit';
import './registerServiceWorker';

Vue.config.productionTip = false
Vue.use(VueCroppie);

let app;
firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      vuetify,
      router,
      template: '<App/>',
      components: { App }
    });
  }
});