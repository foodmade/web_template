/*
 * @Description: 国家代码组件
 * @Author: cb
 * @Date: 2019-06-19 17:06:13
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-03 22:33:53
 */
<template>
  <div class="area-code">
    <van-index-bar :index-list="codeList" v-if="indexList.length !=0">
      <van-index-anchor  index="#">#</van-index-anchor>
        <van-cell @click="toRegister($event,'+86')" title="中国(+86)" />
        <van-cell @click="toRegister($event,'+852')" title="中华人民共和国香港特别行政区(+852)" />
        <van-cell @click="toRegister($event,'+853')" title="中华人民共和国澳门特别行政区(+853)" />
        <van-cell @click="toRegister($event,'+886')" title=" 台湾(+886)" />
      <div v-for="(item,index) in indexList" :key="index">
        <van-index-anchor v-if="item.value.length != 0" :index="item.index">{{item.index}}</van-index-anchor>
         <van-cell @click="toRegister($event,child.code)" v-show="child.length !=0" v-for="(child,gindex) in item.value" :key="gindex" :title="child.countryName +'(' + child.code+')'" />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { area } from "../plugins/phone_area_code";
import { PinYin} from "../plugins/pinyin";
import { IndexBar, IndexAnchor, Cell, Loading } from 'vant';

Vue.use(IndexBar)
Vue.use(IndexAnchor)
Vue.use(Cell)
Vue.use(Loading)
import 'vant/lib/index.css';
import { setTimeout } from 'timers';
export default {
  name: "areaCode",
  components: { IndexBar, IndexAnchor, Cell },
  data() {
    return {
      indexList: [],
      codeList:['#','A','B','C','D','E','F','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'],
      form:{
        mobileArea: '',
        androidurl: '',
        iosurl: '',
        inviteCode: ''
      },
      loading:true
    };
  },
  created(){
    this.form.mobileArea = this.$route.query.mobileArea ? this.$route.query.mobileArea : '86';
    this.form.androidurl = this.$route.query.androidurl;
    this.form.iosurl = this.$route.query.iosurl;
    this.form.inviteCode = this.$route.query.inviteCode;
    this.editorCode()

  },
  mounted(){
  },
  methods: {
    toRegister(e,item){
      e.stopPropagation();
      this.$router.push(`/H5Register?inviteCode=${this.form.inviteCode}&androidurl=${this.form.androidurl}&iosurl=${this.form.iosurl}&mobileArea=${item}`)
    },
    editorCode(){
      let arr1 = [];
      for(let i = 65; i < 91; i++){
          arr1.push({index:String.fromCharCode(i),value:[]});
      }
      this.indexList = arr1;
      area.forEach((item,index) => {
        for(var i in this.indexList){
          if(this.getPinYinFirstCharacter(item.countryName,'',true)[0] == this.indexList[i].index){
            this.indexList[i].value.push(item)
          }
        }
      })
      for(var i in this.indexList){
        if(this.indexList[i].value.length === 0){
          this.indexList.splice(i,1)
        }
      }
    },
    isChinese(str) {
      var entryVal = str;
      var cnChar = entryVal.match(/[^\x00-\x80]/g);
      if (cnChar != null && cnChar.length > 0)
        return true;
      return false;
    },
    getPinYin(str, split,uppercase ) {
      split = split || " ";
      uppercase = uppercase || false;
      var l2 = str.length;
      var result = "";
      var reg = new RegExp('[a-zA-Z0-9\- ]');
      var val;
      var name;
      for (var i = 0; i < l2; i++) {
        val = str.substr(i, 1);
        if (this.isChinese(val)) {
          name = arraySearch(val);
          if (reg.test(val)) {
            result += split + val;
          } else if (name !== false) {
            result += split + name;
          }
        } else {
          result += val;
        }
      }
      if(uppercase) result = result.toUpperCase();
      result = result.replace(split,"");
      return result.trim();
    },
    arraySearch(str) {
      for (var name in PinYin) {
        if (PinYin[name].indexOf(str) != -1) {
          return name;
          break;
        }
      }
      return false;
    },
    getPinYinFirstCharacter(str, split,uppercase) {
      split = split || " ";
      uppercase = uppercase || false;
      var len = str.length;
      var result = "";
      var reg = new RegExp('[a-zA-Z0-9\- ]');
      var val;
      var name;
      for (var i = 0; i < len; i++) {
        val = str.substr(i, 1);
        if (this.isChinese(val)) {
          name = this.arraySearch(val);
          if (reg.test(val)) {
            result += split + val;
          } else if (name !== false) {
            result += split + name.substring(0, 1);
          }
        } else {
          result +=  val;
        }
      }
      if(uppercase) result = result.toUpperCase();
      result = result.replace(split,"");
      return result.trim();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.area-code
  width 100%
  min-height 100%
  background url('../assets/h5-bg.png') no-repeat
  background-size cover
  color #fff
  font-family 'PingFangSC-Regular'
  padding-bottom 20px
</style>
<style lang="stylus">
.area-code
  width 100%
  .van-index-anchor
    background #fff
  .van-cell
    background transparent
    color #fff
  .van-cell:last-child::after
    border 0
  .van-index-bar__index
    font-weight bold
</style>
