/*
 * @Description: 修改密码组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-11 20:04:14
 */
<template>
  <section class="fix-password">
    <section class="head">
      <h1 class="font16">修改密码</h1>
    </section>
    <p class="warning">修改后，点击保存才会生效</p>
    <section class="f-r-c">
      <el-form :model="form" :rules="rules" ref="form"  label-width="200px"  class="fix-pwd-form">
        <el-form-item  prop="originalPassword" label="输入当前密码">
          <el-input onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')" v-model="form.originalPassword" type="password" placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item  prop="password" label="输入要修改的密码">
          <el-input onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')" v-model="form.password" type="password" placeholder="请输入要修改的密码"></el-input>
        </el-form-item>
        <el-form-item  prop="confirmPassword" label="重复输入要修改的密码">
          <el-input onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')" v-model="form.confirmPassword" type="password" placeholder="请重复输入要修改的密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js';
import { mapActions } from "vuex";
import { setTimeout } from 'timers';
export default {
  name: "fixPassword",
  components: {
  },
  data(){
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入6-12位数字和字母的组合，区分大小写'));
      } else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/).test(value)){
        callback(new Error('请输入6-12位数字和字母的组合，区分大小写'))
      }else {
        callback();
      }
    };
    var validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码输入不一致'));
      } else if (value !== this.form.password) {
          callback(new Error('密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      form:{
        originalPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        originalPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入6-12位数字和字母的组合，区分大小写', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '密码输入不一致', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false,
    }
  },
  mounted(){

  },
  methods:{
    ...mapActions(["logOut"]),
    handleSave(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.axios.post(API.updatePassword, this.form).then((res) => {
            try{
              if(res.code === '10000'){
                this.$message.success('保存成功')
                setTimeout(() => {
                  this.logOut()
                },1000)
              }else{
                this.$message.error(res.message)
              }
              this.loading = false
            }catch(e){
              console.log('e',e)
            }
          })        
        } else {
          return false;
        }
      });
     
    }
  }
};
</script>
<style lang="stylus">
.fix-password
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .fix-pwd-form
    margin-top 30px
    .el-input
      width 500px
  .warning
    text-align center
    color #f00
    font-weight bold
    margin-top 200px
</style>
