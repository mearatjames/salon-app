import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './routes'
import firebase from 'firebase';
import './components/firebaseInit';
import './registerServiceWorker'

Vue.config.productionTip = false

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