<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-18 21:47:28
 * @LastEditTime: 2019-09-05 23:49:45
 * @LastEditors: Please set LastEditors
 -->
/*
 * @Description: 登录组件
 * @Author: cb
 * @Date: 2019-06-19 17:06:13
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-09-06 10:21:17
 */
<template>
  <div class="login">
    <h1>集结号后台管理系统</h1>
    <div class="container">
      <el-form :model="form" :rules="rules" ref="ruleForm"  class="ruleForm">
        <el-form-item  prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')" v-model="form.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { API } from '../plugins/api.js'
import { mapActions } from "vuex";
export default {
  name: "login",
  components: {},
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading:false,
    };
  },
  methods: {
    ...mapActions(["accountLogin"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          const list = {
            sysUserName: this.form.username,
            sysUserPassword: this.form.password
          }
          this.accountLogin(list);
          setTimeout(() => {
            this.loading = false;
          },500)
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.login
  background #fff
  padding-top 100px
  h1
    margin 0 auto
    text-align center
    margin-bottom 100px
  .container
    width 300px
    height 300px
    margin 0 auto
    button
      width 100%
</style>
