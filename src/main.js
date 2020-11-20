import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import JsonExcel from 'vue-json-excel'
import MultiUpload from './components/MultiUpload'
import FileUpload from "./components/FileUpload";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.component('downloadExcel',JsonExcel);
Vue.component('uplaodImg',MultiUpload);
Vue.component('uploadVideo',FileUpload);
new Vue({
  render: h => h(App),
}).$mount('#app')
