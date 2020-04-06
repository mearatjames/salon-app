import Vue from 'vue'
import App from './App.vue'
import { MdChips, MdField, MdDatepicker, MdButton, MdDialog, MdDialogConfirm } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'


Vue.config.productionTip = false

Vue.use(MdChips)
Vue.use(MdField)
Vue.use(MdDatepicker)
Vue.use(MdButton)
Vue.use(MdDialog)
Vue.use(MdDialogConfirm)

new Vue({
  render: h => h(App),
}).$mount('#app')
