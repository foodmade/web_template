import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Axios from './plugins/axios';
import vueAxios from 'vue-axios';
import { Base64 } from 'js-base64';
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(vueAxios, Axios);
Vue.use(Base64);
// 根据路由设置标题
router.beforeEach((to, from, next) => {
  /*路由发生改变修改页面的title */
  if(to.meta.title) {
    document.title = to.meta.title
  }
  next();
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
