/*
 * @Description: 用户管理组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-23 14:22:57
 */

<template>
  <section class="user-manage">
    <section class="head">
      <h1 class="font16">用户管理</h1>
    </section>
    <section class="search mt-20">
      <el-form inline label-width="120px">
        <el-form-item label="用户ID">
          <el-input v-model="form.userId" size="medium" class="form-item" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.userPhone" onkeyup = "value=value.replace(/[^\d]/g,'')" size="medium" class="form-item" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.userName" size="medium" class="form-item" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="用户等级">
          <el-select size="medium" v-model="form.userLevel">
            <el-option v-for="(item,index) in levelOption" :key="index" :value="item" :lable="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="邮箱">
          <el-input v-model="form.email" size="medium" class="form-item" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item class="ml-50">
          <el-button @click="getList" type="primary" size="large">搜索</el-button>
          <el-button @click="clearHandel" size="large">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="ml-50">当前总数：{{this.total}}</div>
      <div class="mt-20" style="padding:0 50px">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="data"
          border
          style="width: 100%">
          <el-table-column
            prop="userId"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <!-- <el-table-column
            label="用户等级">
          <template slot-scope="scope">
            <span v-if="scope.row.updateLevel != -1">{{scope.row.updateLevel || '0'}}（{{scope.row.userLevel}}）</span>
            <span v-else>{{scope.row.userLevel}}</span>
          </template>
          </el-table-column> -->
          <el-table-column
            prop="registerTime"
            label="注册时间">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="medium">查看</el-button>
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
import { API } from '../../plugins/api.js'
export default {
  name: "userManage",
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
      form:{
        userId: '',
        userPhone: '',
        userName: '',
        startTime: '',
        endTime: '',
        userLevel: '',
        email:'',
        time:[]
      },
      data: [],
      total: 0,
      page: 1,
      limit: 50,
      loading:false,
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      const list = {
        userId: this.form.userId,
        userPhone: this.form.userPhone,
        userName: this.form.userName,
        // userLevel: this.form.userLevel,
        startTime: this.form.time[0],
        endTime: this.form.time[1],
        currentPage: this.page,
        pageSize:this.limit,
        email:this.form.email
      }
      this.loading = true;
      this.axios.post(API.userList,list).then((res) => {
        try{
          if(res.code === '10000'){
            this.data = res.data;
            this.total = Number(res.total)
          }
          this.loading = false;
        }catch(e){

        }
      })
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
    handleClick(row) {
      this.$router.push('/user-detail?id=' + row.userId)
    },
    clearHandel(){
      this.form ={
        userId: '',
        userPhone: '',
        userName: '',
        startTime: '',
        endTime: '',
        userLevel: '',
        time:[]
      };
      this.limit = 50;
      this.page = 1;
      this.getList()
    },

  }
};
</script>
<style lang="stylus">
.user-manage
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
  .search
    .el-select-dropdown__item
      padding 0 20px
  .el-date-editor .el-range-separator
    width 7%
</style>
