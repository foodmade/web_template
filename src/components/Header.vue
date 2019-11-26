/*
 * @Description: 头部组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-06-28 17:04:30
 */

<template>
  <section class="header flex flex-row flex-between">
    <div>Logo</div>
    <div>
      <span>{{userName}}</span>
      <span class="ml-5 mr-5">|</span>
      <span @click="logoutHandle" class="logout">退出</span>
    </div>
  </section>
</template>

<script>
import { API } from '../plugins/api.js'
import { mapActions } from "vuex";
import store from '../store.js'
export default {
  name: "headContainer",
  components: {
  },
  data(){
    return {
      userName: ''
    };
  },
  mounted(){
    this.userName = store.state.userName
  },
  methods:{
    ...mapActions(["logOut"]),
    logoutHandle(){
        this.logOut()
    }
  }
};
</script>
<style lang="stylus">
.header
  width 100%
  height  80px
  line-height 80px
  color #fff
  background-color $main-color
  padding 0px 20px
  .logout
    cursor pointer
</style>
