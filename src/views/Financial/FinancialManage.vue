/*
 * @Description: 财务管理组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-06-20 16:19:57
 */

<template>
  <section class="financial-manage">
    <section class="head">
      <h1 class="font16">财务管理</h1>
    </section>
    <section class="search mt-20">
      <el-form inline label-width="120px">
        <el-form-item label="流水号">
          <el-input v-model="dto.serialNumber" size="medium" class="form-item" placeholder="请输入流水号"></el-input>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="dto.transactionType" placeholder="">
            <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dto.userPhone" size="medium" class="form-item" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-form-item label="用户钱包地址">
          <el-input v-model="dto.walletAddress" size="medium" class="form-item" placeholder="请输入用户钱包地址"></el-input>
        </el-form-item>
        <el-form-item label="交易hash">
          <el-input v-model="dto.transactionHash" size="medium" class="form-item" placeholder="请输入交易hash"></el-input>
        </el-form-item>
        <el-form-item class="ml-50">
          <el-button @click="getList" type="primary" size="large">搜索</el-button>
          <el-button @click="reset" size="large">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="ml-50">
        <span>当前总数：{{total}}</span>
        <el-button @click="downLoad" class="ml-15" type="primary">导出</el-button>
      </div>
      <div class="mt-20" style="padding:0 50px">
        <el-table
          :data="data"
          border
          style="width: 100%">
          <el-table-column
            prop="accountFlowId"
            label="流水号"
            width="180">
          </el-table-column>
          <el-table-column
            label="类型"
            prop="businessTypeId"
            width="180">
            <template slot-scope="scope">
              <span>{{transactionTypeText(scope.row.businessTypeId)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="交易数额">
          </el-table-column>
          <el-table-column
            prop="flowDate"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="交易人手机号">
          </el-table-column>
          <el-table-column
            prop="walletAddress"
            label="用户钱包地址">
          </el-table-column>
          <el-table-column
            prop="transactionHash"
            label="交易hash">
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
  </section>
</template>

<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js'
export default {
  name: "financialManage",
  components: {
  },
  data(){
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      levelOption:[1, 2, 3, 4, 5],
      dto:{
        serialNumber: '',
        // 类型 10 充币 20 提币 30 提币手续费 
        //      40 提币不通过退回 50 提币手续费退回 60 集结号锁定 
        ///     70 集结号奖励锁定 80 集结号解锁 90 集结号奖励发放
        transactionType: '',
        userPhone: '',
        createTimeStart: '',
        createTimeEnd: '',
        walletAddress: '',
        transactionHash: '',
        currentPage: 1,
        pageSize: 50,
      },
      /**
       *     RECHARGE(10, "充币"),

    WITHDRAW(20, "提币"),

    WITHDRAW_FEE(30,"提币手续费"),

    WITHDRAW_NO_PASS(40,"提币不通过退回"),

    WITHDRAW_FEE_BACK(50,"提币手续费退回"),

    BLOW_LOCK(60,"投入的基础算力"),

    BLOW_REWARD_LOCK(70,"挖矿收益"),

    BLOW_UNLOCK(80,"直推奖励"),

    BLOW_REWARD_UNLOCK(90,"冻结奖励");
       */
      typeOptions:[
        {label: '充币', val: '10'},
        {label: '提币', val: '20'},
        {label: '提币手续费', val: '30'},
        {label: '提币不通过退回', val: '40'},
        {label: '提币手续费退回', val: '50'},
        {label: '投入的基础算力', val: '60'},
        {label: '挖矿收益', val: '70'},
        {label: '直推奖励', val: '80'},
        {label: '冻结奖励', val: '90'},
      ],
      dateTime:[],
      data: [],
      total: 0,
    }
  },
  created(){
    this.getList();
  },
  mounted(){
  },
  methods:{
    getList(){
      const list = this.dto;
      try{
        this.axios.post(API.getTransactionList,list).then((res) => {
          if(res.code === '10000'){
            this.data = res.data;
            this.total = Number(res.total);
          }
        })
      }catch(e){
        console.log(e)
      }      
    },
    reset(){
      this.dto = {
        serialNumber: '',
        // 类型 10 充币 20 提币 30 提币手续费 
        //      40 提币不通过退回 50 提币手续费退回 60 集结号锁定 
        ///     70 集结号奖励锁定 80 集结号解锁 90 集结号奖励发放
        transactionType: '',
        userPhone: '',
        createTimeStart: '',
        createTimeEnd: '',
        walletAddress: '',
        transactionHash: '',
        currentPage: 1,
        pageSize: 50,
      }
      this.dateTime = [];
      this.getList();      
    },
    dateChange(val){
      this.dto.createTimeStart = val[0];
      this.dto.createTimeEnd = val[1];
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
    handleClick(row) {
      console.log(row);
      this.$router.push('/user-detail/' + row.date)
    },
    // 导出
    downLoad(){
      const list = JSON.parse(JSON.stringify(this.dto));
      delete list.currentPage
      delete list.pageSize
      this.axios.post(API.downloadWithdrawList,list).then((res) => {
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
    // 交易类型
    transactionTypeText(target){
      let str = '';
      this.typeOptions.forEach((item) => {
        if(target == item.val){
          str = item.label
        }
      })
      return str;
    }   
  }
};
</script>
<style lang="stylus">
.financial-manage
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .search
    .el-select-dropdown__item
      padding 0 20px
</style>
