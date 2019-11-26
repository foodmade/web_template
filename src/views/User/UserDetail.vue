/*
 * @Description: 用户详情组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-29 10:36:00
 */

<template>
  <section class="user-detail">
    <section class="head">
      <h1 class="font16">用户信息</h1>
    </section>
    <section class="ml-50 mt-20"><el-button type="primary" size="large" @click="back">返回</el-button></section>
    <section v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" class="ml-50 mt-20">
      <div class="user-info">
        <span>用户ID</span>
        <span>{{detailData.user_id || '无'}}</span>
        <span>手机号</span>
        <span>{{detailData.user_phone || '无'}}</span>
      </div>
      <div class="user-info">
        <span>用户名</span>
        <span>{{detailData.user_name || '无'}}</span>
        <span>注册时间</span>
        <span>{{detailData.register_time || '无'}}</span>
      </div>
      <div class="user-info">
        <!-- <span>用户等级</span>
        <span v-if="detailData.update_level != '-1'">{{detailData.update_level || '0'}}（{{detailData.user_level}}）<span class="fix" @click="editorLevel">修改</span></span>
        <span v-else>{{detailData.user_level}}<span class="fix" @click="editorLevel">修改</span></span> -->
        <span>直推累计奖励</span>
        <span>{{detailData.recommendProfit || '0.00'}}代币名称</span>
        <span>累计收益</span>
        <span>{{detailData.total_income || '0.00'}}代币名称</span>
      </div>
      <div class="user-info">
        <span>当前余额</span>
        <span>{{detailData.balance || '0.00'}}代币名称</span>
        <span>提现审核中的冻结余额</span>
        <span>{{detailData.frozen || '0.00'}}代币名称</span>
      </div>
      <div class="user-info">
        <span>累计充币</span>
        <span>{{detailData.recharge_amount || '0.00'}}代币名称</span>
        <span>累计提币</span>
        <span>{{detailData.withdraw_amount || '0.00'}}代币名称</span>
      </div>
      <div class="user-info">
        <span>累计提币手续费</span>
        <span>{{detailData.poundage_amount || '0.00'}}代币名称</span>
        <span>推荐人</span>
        <span v-if="detailData.parentInfo" @click="handleClick(detailData.parentInfo.userId)" class="cursor-pointer color-main">{{detailData.parentInfo.userName || '无'}}</span>
      </div>
      <div class="user-info" style="border-bottom: 1px solid #ebeef5">
        <!-- <span>今日指标</span>
        <span>{{detailData.nextTermIndicator || '无'}}</span> -->
        <span></span>
        <span></span>
      </div>
    </section>
    <section class="mt-20">
      <h1 class="font16">用户头像</h1>
      <div class="avatar" :style="{'background-image':'url('+detailData.user_avatar+')'}"></div>
    </section>
    <section class="mt-20">
      <h1 class="font16">下级统计信息</h1>
        <section v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" class="ml-50 mt-20">
        <div class="user-info">
          <span>直推下级数量（一代）</span>
          <span>{{childData.parentDownCnt || '0'}}</span>
          <span>总邀请数量（无限代）</span>
          <span>{{childData.parentAllCnt || '0'}}</span>
        </div>
        <div class="user-info">
          <span>所有下级充值总额</span>
          <span>{{childData.totalRechargeAmount || '0'}}</span>
          <span>所有下级获利总额</span>
          <span>{{childData.totalIncome || '0'}}</span>
        </div>
        <div class="user-info">
          <span>所有下级总余额</span>
          <span>{{childData.totalBalance || '0'}}</span>
          <span>所有下级总冻结金额</span>
          <span>{{childData.totalFrozen || '0'}}</span>
        </div>
        <div class="user-info" style="border-bottom: 1px solid #ebeef5">
          <span>所有下级提币总额</span>
          <span>{{childData.totalWithdrawAmount || '0'}}</span>
          <span>所有下级手续费总额</span>
          <span>{{childData.poundageAmount || '0'}}</span>
        </div>
      </section>
    </section>
    <section class="search mt-20">
      <div class="ml-50">当前邀请总数：{{total}}<el-button @click="downLoad" :loading="downLoadLoading" type="primary" class="ml-15">导出更多详情</el-button></div>
      <div class="mt-20" style="padding:0 50px">
        <el-table
          :data="data"
          border
          style="width: 100%">
          <el-table-column
            prop="user_id"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="user_phone"
            label="手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="yesterday_quota"
            label="给上级贡献的直推奖励">
          </el-table-column>
          <el-table-column
            prop="register_time"
            label="注册时间">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.user_id)" type="text" size="medium">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt-10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[50, 100, 300]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </section>
  </section>
</template>
<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js';
export default {
  name: "userDetail",
  components: {
  },
  data(){
    return {
      data: [],
      total: 100,
      page: 1,
      limit: 50,
      loading:false,
      detailData:{},
      childData:{},
      userId: '',
      downLoadLoading:false,
    }
  },
  mounted(){
    this.userId = this.$route.query.id;
    this.getDetail();
    this.getList();
    this.getChildStatisticsInfo();
  },
  methods:{
    getDetail(){
      const list = {
        userId: this.userId
      }
      this.loading = true
      this.axios.post(API.userDetailInfo,list).then((res) => {
        try{
          if(res.code === '10000'){
            this.detailData = res.data
            this.loading = false
          }
        }catch(e){

        }
      })
    },
    getList(){
      const list = {
        userId: this.userId,
      }
      try{
        this.axios.post(API.getUserInviteList,list).then((res) => {
            if(res.code === '10000'){
              this.data = res.data;
              this.total = Number(res.total);
            }
        })
      }catch(e){

      }
    },
    back(){
      this.$router.push('/')
    },
    handleSizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.limit = 50;
      this.page = val;
      this.getList()
    },
    handleClick(id) {
      if(id === '-1') {
        return;
      }
      this.userId = id;
      this.getDetail();
      this.getList();
      this.getChildStatisticsInfo();
      this.$router.push('/user-detail?id=' + id)
    },
    getChildStatisticsInfo(){
      const list = {
        userId : this.userId
      }
      this.axios.post(API.getChildStatisticsInfo,list).then((res) => {
        try{
          if(res.code === '10000'){
            this.childData = res.data;
          }
        }catch(e){

        }
      })
    },
    downLoad(){
      const list = {
        userId : this.userId
      };
      this.axios.post(API.downloadChildInvite,list).then((res) => {
        try{
          if(res.code === '10000'){
            this.$message.success(res.message)
          }else{
            this.$message.error(res.message)
          }
        }catch(e){

        }
      })  
    },
    editorLevel(){
      this.$prompt('输入你想修改的用户等级，修改后，用户收益需要达到参数设定的数额后才能继续升级，且不支持低于已获得收益对应等级', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: '请输入大于0的整数'
      }).then(({ value }) => {
        const list = {
          userId:this.userId,
          userLevel:value
        }
        this.axios.post(API.updateUserLevel,list).then((res) => {
          try{
            if(res.code === '10000'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.getDetail()
            }else{
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          }catch(e){

          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });       
      });
    }
  }
};
</script>
<style  lang="stylus">
.user-detail
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .avatar
    width 100px
    height 100px
    border-radius 50%
    margin 20px 50px
    background-position center
    background-repeat no-repeat
  .search
    .el-select-dropdown__item
      padding 0 20px
  .user-info
    width 800px
    height 40px
    line-height 40px
    border-top 1px solid  #EBEEF5
    border-left 1px solid  #EBEEF5
    border-right 1px solid  #EBEEF5
    overflow hidden
    span
      display inline-block
      border-right 1px solid #EBEEF5
      width 25%
      text-align center
      &:last-child
        border-right 0
    .fix
      border 0
      width 45px
      height 25px
      line-height 25px
      background $main-color
      color #fff
      border-radius 5px
      font-size 14px
      margin-left 10px
      cursor pointer
    &:last-child
      border-bottom 1px solid #EBEEF5
</style>
