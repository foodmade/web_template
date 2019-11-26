/*
 * @Description: 公告管理组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-11 19:22:07
 */
<template>
  <section class="announcement-manage">
    <section class="head">
      <h1 class="font16">公告管理</h1>
    </section>
    <section class="mt-20" style="padding:0 50px">
      <el-button @click="addAndEditorHandel('create')" type="primary">新建公告</el-button>
      <p class="mt-20">今日已推送条数：{{todayPush}}</p>
      <el-table
        :data="data"
        border
        class="mt-30"
        style="width: 100%">
        <el-table-column
          prop="pushId"
          label="公告ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pushTitle"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pushBody"
          label="摘要">
        </el-table-column>
        <el-table-column
          prop="pushPort"
          label="推送端口">
          <!-- pushPortText -->
          <template slot-scope="scope">
            <span>{{pushPortText(scope.row.pushPort)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="推送人">
        </el-table-column>
        <el-table-column
          prop="pushTime"
          label="推送时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button @click="addAndEditorHandel('editor',scope.row)" type="text" size="medium">编辑</el-button>
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
    </section>
    <!-- 新建弹窗 -->
    <el-dialog
      :title="title"
      :visible="createVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="createClose">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form">
          <el-form-item label="标题" prop="pushTitle">
            <el-input v-model="form.pushTitle" placeholder="请输入1-16个字符，支持中英文、数字、特殊符号"></el-input>
          </el-form-item>
          <el-form-item label="正文" prop="pushBody">
            <el-input v-model="form.pushBody" type="textarea" maxlength="500" show-word-limit placeholder="请输入1-500个字符，支持中英文、数字、特殊符号"></el-input>
          </el-form-item>
          <el-form-item label="推送端口" prop="pushPort">
            <el-radio-group v-model="form.pushPort">
              <el-radio :label="3">全部</el-radio>
              <el-radio :label="1">ios</el-radio>
              <el-radio :label="2">android </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer flex flex-center">
        <el-button @click="createClose">取 消</el-button>
        <el-button :loading="createLoading" type="primary" @click="createSubmit">确认</el-button>
      </span>
    </el-dialog>
    <!-- 新建弹窗 -->
  </section>
</template>
<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js';
export default {
  name: "announcementManage",
  components: {
  },
  data(){
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      todayPush:0,
      readVisible: false,
      createVisible: false,
      createLoading: false,
      form: {
        pushTitle: '',
        pushBody:'',
        pushId:'',
        pushPort:'',
      },
      rules: {
        pushTitle: [
          { required: true, message: '请输入1-16个字符，支持中英文、数字、特殊符号', trigger: 'blur' },
          { min: 1, max: 16, message: '请输入1-16个字符，支持中英文、数字、特殊符号', trigger: 'blur' }
        ],
        pushBody: [
          { required: true, message: '请输入1-16个字符，支持中英文、数字、特殊符号', trigger: 'blur' },
          { min: 1, max: 500, message: '请输入1-16个字符，支持中英文、数字、特殊符号', trigger: 'blur' }
        ],
        pushPort: [
          { required: true, message: '请输入端口', trigger: 'change' },
        ],
      },
      title:'新建推送',
      row:{}
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(){
      const list = {
        currentPage:this.page,
        pageSize:this.limit
      }
      try{
        this.axios.post(API.getNoticeList,list).then((res) => {
            if(res.code === '10000'){
              this.data = res.data ? res.data.list : null;
              this.total = Number(res.total);
              this.todayPush = res.data ? res.data.pushCnt : 0;
            }
        })
      }catch(e){

      }
    },
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.limit = 50;
      this.page = val;
      this.getList();
    },
    // 新建
    addAndEditorHandel(str,row){
      this.createVisible = true;
      this.title = str === 'create' ? '新建推送' : '编辑推送';
      this.form = str === 'create' ? {
        pushTitle: '',
        pushBody:'',
        pushId:'',
        pushPort:''
      } : {
        pushTitle: row.pushTitle,
        pushBody: row.pushBody,
        pushId: row.pushId,
        pushPort: row.pushPort
      };
      console.log('row',row)
    },
    // 新建弹窗关闭
    createClose(){
      this.createVisible = false;
      this.createLoading = false;
      this.$refs['form'].resetFields();
    },
    // 新建版本 提交
    createSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.createLoading = true;
          try{
            this.axios.post(API.setNoticeInfo,this.form).then((res) => {
              if(res.code === '10000'){
                this.createLoading = false;
                this.createClose();
                this.getList();
              }
            })
          }catch(e){
            console.log(e)
          }
        } else {
          return false;
        }
      });
    },
    pushPortText(n){
      if(n === 1){
        return 'ios'
      }else if(n === 2){
        return 'android'
      }else if(n === 3){
        return '全部'
      }else{
        return '无'
      }
    }
  }
};
</script>
<style lang="stylus">
.announcement-manage
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
</style>
