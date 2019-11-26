/*
 * @Description: 提币审核组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-09-06 10:45:35
 */
<template>
  <section class="coin-check">
    <section class="head">
      <h1 class="font16">提币审核</h1>
    </section>
    <section class="search mt-20">
      <el-form inline label-width="120px">
        <el-form-item label="用户ID">
          <el-input v-model="dto.useId" size="medium" class="form-item" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dto.userPhone" size="medium" class="form-item" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="dateTime"
            @change="dateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="dto.status" placeholder="">
            <el-option label="成功" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml-50">
          <el-button @click="getList" type="primary" size="large">搜索</el-button>
          <el-button @click="reset" size="large">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="ml-50">
        <span>当前总数：{{total}}</span>
        <el-button :disabled="multipleSelection.length == 0" @click="checkClick('batch')" class="ml-15" type="primary">批量审核</el-button>
      </div>
      <div class="mt-20" style="padding:0 50px">
        <el-table
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @select="rowSelect"
          @select-all="allSelect"
          :data="data"
          border
          style="width: 100%">
          <el-table-column
            type="selection"
            :selectable="selectStatus"
            width="55">
          </el-table-column>
          <el-table-column
            prop="withdrawFlowId"
            label="提币单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="交易人手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="withdrawTime"
            label="提交时间">
          </el-table-column>
          <el-table-column
            prop="withdrawAmount"
            label="提币数量">
          </el-table-column>
          <el-table-column
            prop="poundageAmount"
            label="手续费">
          </el-table-column>
          <el-table-column
            prop="accountAmount"
            label="实际到账">
          </el-table-column>
          <el-table-column
            prop="status"
            label="交易状态">
            <template slot-scope="scope">
              <span>{{statusText(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status == 0" @click="checkClick('single',scope.row)" type="text" size="medium">审核</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="medium">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt-10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dto.currentPage"
          :page-sizes="[50, 100, 300]"
          :page-size="dto.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </section>
    <!-- 提币审核 批量审核 弹窗 -->
    <el-dialog
      :title="checkTitle"
      :visible="checkVisible"
      width="23%"
      :close-on-click-modal="false"
      :before-close="checkClose">
      <p>如何处理这些提现？通过后将自动完成转账</p>
      <div class="flex flex-center mt-30">
        <el-radio-group v-model="checked">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">拒绝</el-radio>
        </el-radio-group>   
      </div>
      <span slot="footer" class="dialog-footer flex flex-center">
        <el-button @click="checkClose">取 消</el-button>
        <el-button type="primary" @click="checkSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提币审核 批量审核 弹窗 -->
    <!-- 提币审核详情 -->
    <el-dialog
      title="提币审核详情"
      :visible="detailVisible"
      :close-on-click-modal="false"
      width="60%"
      :before-close="detailClose">
      <!-- 用户信息 -->
      <div v-if="detailData.withdrawDetail" class="info-table">
        <p class="row">
          <span class="tit">用户ID</span>
          <span class="info">{{detailData.withdrawDetail.userId}}</span>
          <span class="tit">手机号</span>
          <span class="border-r0 info">{{detailData.withdrawDetail.userPhone}}</span>
        </p>
        <p class="row">
          <span class="tit">提交时间</span>
          <span class="info">{{detailData.withdrawDetail.withdrawTime}}</span>
          <span class="tit">提币数量</span>
          <span class="border-r0 info">{{detailData.withdrawDetail.withdrawAmount}}</span>
        </p>
        <p class="row">
          <span class="tit">手续费</span>
          <span class="info">{{detailData.withdrawDetail.poundageAmount}}</span>
          <span class="tit">实际到账</span>
          <span class="border-r0 info">{{detailData.withdrawDetail.accountAmount}}</span>
        </p>
        <p class="row">
          <span class="tit border-b0">交易状态</span>
          <span class="border-b0 info">{{statusText(detailData.withdrawDetail.status)}}</span>
          <span class="tit border-b0"></span>
          <span class="border-r0 border-b0 info"></span>
        </p>
      </div>
      <!-- 用户信息 -->
      <!-- 提币区块链详情 -->
      <div v-if="detailData.blockChainList && detailData.blockChainList.length != 0">
        <h2>提币区块链详情</h2>
        <div v-for="(item,index) in detailData.blockChainList" :key="index" class="info-table mt-15">
          <p class="row">
            <span class="tit">交易hash</span>
            <span class="info">{{item.txnhash}}</span>
            <span class="tit">提交时间</span>
            <span class="border-r0 info">{{item.committime}}</span>
          </p>
          <p class="row">
            <span class="tit">转账金额</span>
            <span class="info">{{item.withdrawamount}}</span>
            <span class="tit"></span>
            <span class="border-r0 info"></span>
          </p>
          <p class="row">
            <span class="tit border-b0">状态</span>
            <span class="info border-b0">{{statusBlockText(item.status)}}</span>
            <span class="tit border-b0">操作</span>
            <span v-if="item.status === 4" @click="anewHandle(item)" class="border-r0 info border-b0 color-main cursor-pointer">重新发起</span>
            <span v-else class="border-r0 info border-b0 color-main cursor-pointer"></span>
          </p>
        </div>
      </div>
      <!-- 提币区块链详情 -->
      <span slot="footer" class="dialog-footer flex flex-center">
        <el-button @click="detailVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 提币审核详情 -->
  </section>
</template>

<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js'
export default {
  name: "coinCheck",
  components: {
  },
  data(){
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      multipleSelection: [], // 批量审核列表
      dto:{
        userId: '',
        userPhone: '',
        createTimeStart: '',
        createTimeEnd: '',
        status: '',
        currentPage: 1,
        pageSize: 50,
      },
      dateTime:[],
      data: [],
      total: 0,
      checkTitle: '', // 审核title
      checkVisible: false, // 审核visible
      checked: '', // 是否通过审核  1 通过 2 拒绝
      detailVisible: false, // 提币审核详情
      detailData:{},
      row:{}
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(){
      const list = this.dto;
      try{
        this.axios.post(API.getWithdrawList,list).then((res) => {
          if(res.code === '10000'){
            this.data = res.data;
            this.total = Number(res.total);
          }
        })
      }catch(e){
        console.log(e)
      }      
    },
    batchPost(arr,status){
      const list = {
        withdrawFlowIds: arr,
        status :status
      };
      try{
        this.axios.post(API.batchReview,list).then((res) => {
          if(res.code === '10000'){
            this.getList();
          }
        })
      }catch(e){
        console.log(e)
      }      
    },
    dateChange(val){
      this.dto.createTimeStart = val[0];
      this.dto.createTimeEnd = val[1];      
    },
    reset(){
      this.dto = {
        userId: '',
        userPhone: '',
        createTimeStart: '',
        createTimeEnd: '',
        status: '',
        currentPage: 1,
        pageSize: 50,
      }
      this.dateTime = [];
      this.getList();         
    },
    // 批量勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowSelect(val,row){
      
    },
    allSelect(val){

    },
    selectStatus(row,index){
      if(row.status === 0){
        return true
      }else{
        return false
      }
    },
    handleSizeChange(val) {
      this.dto.currentPage = 1;
      this.dto.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.dto.currentPage = val;
      this.dto.pageSize = 50;
      this.getList();
    },
    // 审核操作
    checkClick(status,row) {
      // batch 批量审核 ， single 单个审核
      this.checkTitle = status  === 'batch' ? '批量提现审核' : '提现审核';
      this.checkVisible = true;
      this.row = row;
      // console.log('单个审核')
    },
    // 关闭审核弹窗
    checkClose() {
      this.checkVisible = false;
      this.checked = '';
    },
    // 审核提交
    checkSubmit(){
      if(this.checked == ''){
        this.$message.warning('请选择是否通过审核')
        return
      }
      const list = {
        withdrawFlowIds: [],
        status: this.checked
      }
      if (this.checkTitle === '批量提现审核') {
        this.multipleSelection.forEach((item) => {
          list.withdrawFlowIds.push(item.withdrawFlowId)
        })
      }else{
        list.withdrawFlowIds.push(this.row.withdrawFlowId)
      }
      try{
        this.axios.post(API.batchReview,list).then((res) => {
          if(res.code === '10000'){
            this.getList();
            this.checkClose();
            this.$message.success(res.message)
          }else{
            this.$message.error(res.message)
          }
        })
      }catch(e){
        console.log(e)
      }
    },
    // 查看
    handleClick(row) {
      this.detailVisible = true;
      this.row = row;
      this.getDetail();
    },
    // 详情
    getDetail(){
      const list = {
        withdrawFlowId: this.row.withdrawFlowId
      }
      try{
        this.axios.post(API.reviewDetail,list).then((res) => {
          if(res.code === '10000'){
            this.detailData = res.data
          }
        })
      }catch(e){
        console.log(e)
      }
    },
    // 关闭详情弹窗
    detailClose(){
      this.detailVisible = false;
    },
    // 重新发起
    anewHandle(item){
      this.$confirm('是否重新发起转账？', '提示', {
        confirmButtonText: '重新发起',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '发起成功'
        // });
        try{
          this.axios.post(API.tryBatchReview,{transferId: item.id}).then((res) => {
            if(res.code === '10000'){
              this.getDetail()
            }else{
              this.$message.error(res.message)
            }
          })
        }catch(e){
          console.log(e)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    statusText(n){
      if(n === 0){
        return '待审核'
      }else if(n === 1){
        return '已通过'
      }else if(n === 2){
        return '已撤销'
      }else if(n === 3){
        return '转账中'
      }else if(n === 4){
        return '失败'
      }else if(n === 5){
        return '转账完成'
      }else{
        return '无'
      }
    },
    statusBlockText(n){
      if(n === 0){
        return '转账中'
      }else if(n === 1){
        return ''
      }else if(n === 2){
        return ''
      }else if(n === 3){
        return '转账中'
      }else if(n === 4){
        return '失败'
      }else if(n === 5){
        return '成功'
      }else{
        return '无'
      }      
    }
  }
};
</script>
<style lang="stylus">
.coin-check
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  h2
    font-size 18px
    font-weight 400
    color #303133
    border-bottom 1px solid #eee
    padding 10px 0
  .search
    .el-select-dropdown__item
      padding 0 20px
  .el-dialog__body
    padding-top 20px
    padding-bottom 20px
.info-table
  border 1px solid #e4e7ed
  .row
    display flex
    flex-direction row
    span
      display inline-block
      height: 30px;
      line-height: 30px;
      border-right 1px solid #e4e7ed
      border-bottom 1px solid #e4e7ed
      text-align center
      overflow hidden
    .tit
      background #efefef
      width 20%
    .info
      flex 1
    .border-r0
      border-right 0
    .border-b0
      border-bottom 0
</style>
