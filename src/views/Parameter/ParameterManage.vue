/*
 * @Description: 参数管理组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-12 14:28:42
 */
<template>
  <section class="parameter-manage">
    <section class="head">
      <h1 class="font16">参数管理</h1>
    </section>
    <p class="warning mt-30">！！！修改此页参数将影响用户，请提前通过公告告知用户。修改后，点击保存才会生效！！！</p>
    <section v-loading="loading" class="info">
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c">用户总指标数量=等级*等级*</span>
            <el-input v-model="detailData.userTotalIndicator.muti" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
            <span class="f-c-c mlr-5">+</span>
            <el-input v-model="detailData.userTotalIndicator.add" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
          </div>
          <p class="dsc">修改参数后，若指标增加，则增加用户对应指标，若指标减少，则扣减用户对应指标</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c">用户升级所需收益=等级*等级*</span>
            <el-input v-model="detailData.userPromoteLevel" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
            <span class="f-c-c mlr-5">/2</span>
          </div>
          <p class="dsc">修改参数后，若使得用户等级降低，则对单个用户不生效，但用户后续升级需要取得对应收益，若使得用户等级升高，则生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c">每日解锁份额=等级*</span>
            <el-input v-model="detailData.dayUnlock" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
          </div>
          <p class="dsc">修改值会影响用户解锁速度，修改后，次日生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c mr-10">吹响集结号奖励比例</span>
            <el-input v-model="detailData.blowRewardScale" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
            <span class="f-c-c mlr-5">%</span>
          </div>
          <p class="dsc">吹响集结号奖励比例限制了用户吹响集结号可获得的奖励比例，修改后，次日生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c mr-10">最低提币数量</span>
            <el-input v-model="detailData.withdrawMin" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
          </div>
          <p class="dsc">最低提币数量限制了用户单笔提现的最小提币数量，修改后，立即生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c mr-10">提现手续费率</span>
            <el-input v-model="detailData.withdrawFee" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
          </div>
          <p class="dsc">提现手续费率限制了用户单笔提现所扣的手续费，修改后，立即生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
      <div class="cell flex flex-row flex-between">
        <div class="left flex flex-column f-c-c">
          <div class="flex flex-row">
            <span class="f-c-c mr-10">单日提现限额</span>
            <el-input v-model="detailData.dayWithdrawLimit" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" size="small"/>
          </div>
          <p class="dsc">单日提现限额限制了用户单日提现的最大数量，修改后，立即生效</p>
        </div>
        <div class="f-c-c">
          <el-button @click="handleSave" type="primary">保存</el-button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js';
export default {
  name: "parameterManage",
  components: {
  },
  data(){
    return {
      detailData: {
        blowRewardScale: "0",
        dayUnlock: "0",
        dayWithdrawLimit: "0",
        userPromoteLevel: "0",
        userTotalIndicator:{
            add: "0",
            muti: "0"
        },
        withdrawFee: "0",
        withdrawMin: "0"
      },
      loading: false,
    }
  },
  mounted(){
    this.getDetail();
  },
  methods:{
    getDetail(){
      this.loading = true
      this.axios.post(API.getConfiguration,{}).then((res) => {
        try{
          if(res.code === '10000'){
            this.detailData = res.data
            this.loading = false
          }
        }catch(e){

        }
      })
    },
    handleSave(){
      this.axios.post(API.configuration, this.detailData).then((res) => {
        try{
          if(res.code === '10000'){
            this.getDetail();
            this.$message.success('保存成功')
          }else{
            this.$message.error(data.message)
          }
        }catch(e){

        }
      })     
    }
  }
};
</script>
<style lang="stylus">
.parameter-manage
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .warning
    font-size 18px
    color #f00
    text-align center
    font-weight bold
  .info
    width 1000px
    height 700px
    border 1px solid #333
    margin 0 auto
    margin-top 30px
    .cell
      width 100%
      height 100px
      border-bottom 1px solid #333333
      padding 10px 20px
      color #333
      &:last-child
        border-bottom 0
      .left
        flex 1
      .el-input--small
        width 200px
      button
        width 100px
        height 40px
      .dsc
        font-size 15px
        color #bdbdbd
        margin-top 10px
</style>
