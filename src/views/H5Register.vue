/*
* @Description: H5注册组件
* @Author: cb
* @Date: 2019-06-19 17:06:13
* @Last Modified by: zhegu
* @Last Modified time: 2019-07-11 16:51:58
*/
<template>
  <div class="h5-register">
    <van-loading v-if="loading" type="spinner" vertical>
      加载中...
    </van-loading>
    <h1>一键参与ECC轻量化挖矿</h1>
    <div class="container">
      <div class="tab-bar-box">
        <div>
                    <span :class="{active: registerType === 'email'}" @click="registerType = 'email'">
                        邮箱注册
                    </span>
        </div>
        <div>
                    <span :class="{active: registerType === 'mobile'}" @click="registerType = 'mobile'">
                        手机号注册
                    </span>
        </div>
      </div>
      <template v-if="registerType === 'email'">
        <van-cell-group class="item" :border="false">
          <van-field @blur="phoneValidate" :border="false" v-model="form.email" type="number" placeholder="请输入邮箱"/>
        </van-cell-group>
        <p v-if="phoneValidateVisible" class="err-msg">{{errorText6}}</p>
        <van-cell-group class="item" :border="false">
          <van-field @blur="codeValidate" :border="false" v-model="form.code" type="number" placeholder="请输入邮箱验证码"/>
          <van-button @click="sendCode" :disabled="disabled" class="get-code">{{disabled?count:codeText}}</van-button>
        </van-cell-group>
        <p v-if="codeValidateVisible" class="err-msg">{{errorText7}}</p>
      </template>
      <template v-else>
        <van-cell-group class="item" :border="false">
              <span class="area-code f-r-c" @click="selectArea($event)">
                <span class="f-c-c">+{{this.form.mobileArea}}</span>
                <van-icon class="f-c-c" name="arrow"/>
              </span>
          <van-field @blur="phoneValidate" :border="false" v-model="form.userPhone" type="number" placeholder="请输入手机号码"/>
        </van-cell-group>
        <p v-if="phoneValidateVisible" class="err-msg">{{errorText1}}</p>
        <van-cell-group class="item" :border="false">
          <van-field @blur="codeValidate" :border="false" v-model="form.code" type="number" placeholder="请输入短信验证码"/>
          <van-button @click="sendCode" :disabled="disabled" class="get-code">{{disabled?count:codeText}}</van-button>
        </van-cell-group>
        <p v-if="codeValidateVisible" class="err-msg">{{errorText2}}</p>
      </template>
      <van-cell-group class="item" :border="false">
        <van-field @blur="pwdValidate" :border="false" v-model="form.userPassword" type="password" placeholder="请输入登录密码"/>
      </van-cell-group>
      <p v-if="pwdValidateVisible" class="err-msg">{{errorText3}}</p>
      <van-cell-group class="item" :border="false">
        <van-field @blur="pwd2Validate" :border="false" v-model="form.userPasswordConfirm" type="password" placeholder="请重复输入登录密码"/>
      </van-cell-group>
      <p v-if="pwd2ValidateVisible" class="err-msg">{{errorText4}}</p>
      <van-cell-group class="item" :border="false">
        <van-field @blur="inviteCodeValidate" :border="false" v-model="form.inviteCode" placeholder="请输入邀请码（必填）"/>
      </van-cell-group>
      <p v-if="inviteValidateVisible" class="err-msg">{{errorText5}}</p>
      <div class="f-r-c">
        <van-button @click="submitForm" class="register">注册</van-button>
      </div>
      <p class="mt-15 agree">点击"注册"即表示同意《注册协议》</p>
      <div class="app f-r-c">
        <div class="upload f-r-c">
          <div class="f-c-c"><img src="../assets/ai-app@2x.png"/></div>
          <span @click="openApp(2)" class="f-c-c">Android下载</span>
        </div>
        <div class="upload f-r-c">
          <div class="f-c-c"><img src="../assets/ios@2x.png"/></div>
          <span @click="openApp(1)" class="f-c-c">iOS下载</span>
        </div>
      </div>
    </div>
    <van-dialog
            v-model="modalVisible"
            :show-confirm-button="false"
            className="register-modal"
    >
      <div class="msg f-r-c">
        <img src="../assets/duigou-2@2x.png"/>
        <span>注册成功</span>
      </div>
      <div @click="uploadApp" class="register-btn">
        立刻下载APP
      </div>
    </van-dialog>
  </div>
</template>
<script>
  // @ is an alias to /src
  import { API } from '../plugins/api.js';
  import { port } from '../plugins/config';
  import Vue from "vue";
  import { Field, CellGroup, Icon, Button, Loading, Toast, Popup, Dialog } from 'vant';

  Vue.use(Field);
  Vue.use(CellGroup);
  Vue.use(Icon);
  Vue.use(Button);
  Vue.use(Loading);
  Vue.use(Toast);
  Vue.use(Popup);
  Vue.use(Dialog);
  import 'vant/lib/index.css';

  export default {
    name: "h5Register",
    components: {Field, CellGroup, Icon, Button},
    data () {
      return {
        loading: false,
        port: 1,
        form: {
          userPhone: '',
          code: '',
          userPassword: '',
          userPasswordConfirm: '',
          inviteCode: '',
          mobileArea: '86',
          email:''
        },
        disabled: false,
        phoneValidateVisible: false,
        codeValidateVisible: false,
        pwdValidateVisible: false,
        pwd2ValidateVisible: false,
        inviteValidateVisible: false,
        errorText1: '',
        errorText2: '',
        errorText3: '',
        errorText4: '',
        errorText5: '',
        errorText6: '',
        errorText7: '',
        timer: null,
        count: 60,
        codeText: '获取验证码',
        androidurl: '',
        iosurl: '',
        modalVisible: false,
        registerType: 'email'
      };
    },
    watch: {},
    created () {
      this.form.mobileArea = this.$route.query.mobileArea ? this.$route.query.mobileArea : '86';
      this.androidurl = this.$route.query.androidurl
      this.iosurl = this.$route.query.iosurl
      this.form.inviteCode = this.$route.query.inviteCode
    },
    mounted () {
      this.port = port() === 'ios' ? 1 : 2;
    },
    methods: {
      phoneValidate () {
        const myreg = /^\d{6,12}$/;
        if (!myreg.test(this.form.userPhone)) {
          this.phoneValidateVisible = true;
          this.errorText1 = "请输入正确的手机号";
          return false
        } else {
          this.phoneValidateVisible = false;
          return true
        }
      },
      codeValidate () {
        if (!this.form.code) {
          this.codeValidateVisible = true;
          this.errorText2 = "验证码错误"
        } else {
          this.codeValidateVisible = false;
        }
      },
      pwdValidate () {
        if (!this.form.userPassword) {
          this.pwdValidateVisible = true;
          this.errorText3 = "密码至少8位且必须包含字母和数字"
        } else {
          this.pwdValidateVisible = false;
        }
      },
      pwd2Validate () {
        if (!this.form.userPasswordConfirm) {
          this.pwd2ValidateVisible = true;
          this.errorText4 = "请再次输入密码"
        } else if (this.form.userPasswordConfirm != this.form.userPassword) {
          this.pwd2ValidateVisible = true;
          this.errorText4 = "两次密码不一致"
        } else {
          this.pwd2ValidateVisible = false;
        }
      },
      inviteCodeValidate () {
        if (!this.form.inviteCode) {
          this.inviteValidateVisible = true;
          this.errorText5 = "请输入邀请码"
        } else {
          this.inviteValidateVisible = false;
        }
      },
      sendCode () {
        if (!this.phoneValidate()) {
          return
        } else {
          const list = {
            userPhone: this.form.userPhone,
            valiDation: 1,
            mobileArea: this.form.mobileArea,
          }
          this.axios.post(API.sendSmsCode, list).then((res) => {
            try {
              if (res.code === '10000') {
                const TIME_COUNT = 60;
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.disabled = true;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      this.disabled = false;
                      this.codeText = '重新获取验证码'
                      clearInterval(this.timer);
                      this.timer = null;
                    }
                  }, 1000)
                }
                Toast('短信已发送');
              } else {
                Toast.fail(res.message);
              }
            } catch (e) {

            }
          })

        }
      },
      submitForm () {
        this.phoneValidate();
        this.codeValidate();
        this.pwdValidate();
        this.pwd2Validate();
        this.inviteCodeValidate();
        const arr = [this.phoneValidateVisible, this.codeValidateVisible, this.pwdValidateVisible, this.pwd2ValidateVisible, this.inviteValidateVisible];
        const isPass = arr.every(item => item === false);
        if (!isPass) {
          return
        } else {
          try {
            this.axios.post(API.h5Register, this.form).then((res) => {
              if (res.code === '10000') {
                // Toast.success('成功文案');
                this.modalVisible = true;
              } else {
                Toast.fail(res.message);
              }
            })
          } catch (e) {

          }
        }
      },
      selectArea (e) {
        e.stopPropagation();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$router.push(`/areaCode?inviteCode=${this.form.inviteCode}&androidurl=${this.androidurl}&iosurl=${this.iosurl}&mobileArea=${this.form.mobileArea}`)
        }, 200)
      },
      openApp (n) {
        const url = n == 1 ? this.iosurl : this.androidurl;
        window.open(url)
      },
      uploadApp () {
        const url = this.port == 1 ? this.iosurl : this.androidurl;
        window.open(url)
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .h5-register
    width 100%
    min-height 100%
    background url('../assets/h5-bg.png') no-repeat
    background-size cover
    color #fff
    font-family 'PingFangSC-Regular'
    padding-bottom 20px

    .register-modal
      width 280px
      height 175px

      .msg
        margin-top 53px
        font-size 16px
        color #333
        font-weight bold

        img
          width 21px
          height 18px
          margin-right 10px

      .register-btn
        width 250px
        height 40px
        line-height 40px
        background-image url('../assets/99@2x.png')
        background-position center
        background-repeat no-repeat
        margin 0 auto
        text-align center
        border-radius 8px
        margin-top 46px

    .err-msg
      color #f00
      font-size 12px
      padding-left 16px

    h1
      font-size 24px
      padding-top 30px
      margin-bottom 30px
      text-align center

    .container
      padding 0 10px

      .item
        border-bottom 1px solid #EDEEEF
        margin-bottom 15px

    .area-code
      position relative
      width 60px
      text-align center
      color #fff
      cursor pointer

      span
        width 100%
        height 100%
        font-size 14px

      i
        position absolute
        right -10px
        top 15px

    .agree
      font-size 11px
      font-weight 400
      color rgba(255, 255, 255, 1)
      line-height 40px
      text-align center

    .app
      width 100%
      height 43px
      margin-top 30px

      .upload
        width 45%
        height 100%
        border 1px solid #ccc
        border-radius 4px

        img
          width 30px
          margin-right 10px

        span
          font-size 14px

        &:nth-child(1)
          margin-right 20px
</style>
<style lang="stylus">
  .h5-register
    .van-cell-group, .van-cell
      background transparent
      display flex

      .van-field__body, .van-field__control
        color #fff
        font-size 14px

    .van-loading
      height 50px
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      margin auto

    .get-code
      border 0
      background transparent
      color #fff
      width 160px
      padding 0
      outline none

    .register
      width 88%
      height 44px
      margin-top 30px
      color #393859
      font-size 16px
      opacity 0.77
      border-radius 4px
    input:

    :-webkit-input-placeholder
      color #E0E0E0

  .tab-bar-box
    margin-bottom 20px;
    display flex

    > div
      flex 1
      margin 0 10px

    :first-child
      text-align right
    span
      display inline-block
      padding-bottom 5px
      border-bottom 2px solid #f8c93b00
      cursor pointer

    span.active
      border-bottom 2px solid #f8c93b
</style>
