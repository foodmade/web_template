import Vue from "vue";
import Vuex from "vuex";
import router from "./router.js"
import { API } from "./plugins/api.js"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("jjh_token"),
    userName: localStorage.getItem("jjh_userName"),
  },
  mutations: {
    // 修改Token
    updateToken: (state, data) => {
      state.token = data;
    },
    // 修改userName
    updateUserName: (state, data) => {
      state.userName = data;
    },
  },
  actions: {
    // 登录
    async accountLogin({commit}, data) {
      try {
        const res = await Vue.axios.post(API.login, data);
        if (res && res.code === "10000") {
          const token = res.data.userId + "_" + res.data.token;
          commit("updateToken", token);
          commit("updateUserName", res.data.userName);
          // 将token存入本地
          localStorage.setItem("jjh_token", token);
          localStorage.setItem("jjh_userId", res.data.userId);
          localStorage.setItem("jjh_userName", res.data.userName);
          setTimeout(() => {
            router.push('/')
          },200)
        } else {
          Vue.prototype.$message.error(res.message);
        }
      } catch (err) {
        throw new Error(err || 'Unknow Error!');
      }
    },
    // 退出登录
    async logOut({ commit }) {
      await Vue.axios.post(API.logout,{}).then((res) => {
        if(res.code === '10000'){
          localStorage.clear();
          commit('updateToken', null);
          sessionStorage.setItem("activeMenu", "1-1");
          router.push('/login')
        }else{
          Vue.prototype.$message.error(res.message)
        }
      })
    }
  }
});
