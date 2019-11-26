/*
 * @Description: 数据统计组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-06-20 16:19:57
 */
<template>
  <section class="data-statistics">
    <section class="head">
      <h1 class="font16">数据统计</h1>
    </section>
    <section class="update">
      <div>
        <span>最近更新时间：{{info.updatetime}}</span>
        <el-button @click="update" class="ml-10" :loading="loading" type="primary">立即更新</el-button>
      </div>
    </section>
    <section v-loading="infoLoading" class="info">
      <p>当前所有用户余额：{{info.totalbalance}}</p><p class="des">用户余额包含锁定余额</p>
      
      <p>当前所有用户累计投入基础算力:{{info.totalCal}}</p>
      <p>累计充值：{{info.totalrechargeamount}}</p>
      <p class="des">用户余额包含锁定余额</p>
      <!-- <p>当前所有用户锁定余额：{{info.totalfrozen}}</p> -->
      <p>累计提出：{{info.totalwithdrawamount}}</p>
      <p class="des">昨日累计提出不包含手续费</p>
      <p>昨日累计提出不包含手续费</p>
      <p>累计获得手续费：{{info.totalpoundageamount}}</p>
      <p>当前所有用户累计获得增量收益:{{info.rateRecommendIncome}}</p>
      <p>当前所有用户累计获得直推总奖励:{{info.validProfitRecommendIncome + info.invalidProfitRecommendIncome}}</p>
      <p class="des">当前所有用户累计获得直推冻结奖励:{{info.invalidProfitRecommendIncome}}</p>
    </section>
  </section>
</template>

<script>
import { API } from '../../plugins/api.js';
export default {
  name: "dataStatistics",
  components: {
  },
  data(){
    return {
      infoLoading: false,
      loading: false,
      info: {}
    }
  },
  mounted(){
    this.getInfo();
  },
  methods:{
    getInfo(){
      this.infoLoading = true
      this.axios.post(API.getTodayStatisticsInfo,{}).then((res) => {
        try{
          if(res.code === '10000'){
            this.info = res.data
            this.infoLoading = false
          }
        }catch(e){

        }
      })
    },
    update(){
      this.loading = true;
      this.axios.post(API.updateStatistics,{}).then((res) => {
        try{
          if(res.code === '10000'){
            this.getInfo()
            this.$message.success('更新成功')
          }else{
            this.$message.error(res.message)
          }
          setTimeout(() => {
            this.loading = false;
          },200)
        }catch(e){

        }
      })
    }
  }
};
</script>
<style lang="stylus">
.data-statistics
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .update
    margin-left 100px
    margin-top 30px
  .info 
    margin-left 100px
    margin-top 50px
    p
      font-size 20px
      font-weight bold
      margin-top 30px
    .des
      font-size 16px
      font-weight 100
      margin-top 10px
</style>
