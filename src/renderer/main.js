import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

const electron = require('electron');
const { ipcRenderer } = electron;

// 引入 iview
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';    // 使用 CSS

// 引入 Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.prototype.domain = 'http://127.0.0.1:3002/';
Vue.prototype.ipcRenderer = ipcRenderer;


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
