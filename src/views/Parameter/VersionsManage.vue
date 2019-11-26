/*
 * @Description: 版本管理组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:57
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-09-06 10:45:04
 */
<template>
  <section class="versions-manage">
    <section class="head">
      <h1 class="font16">版本管理</h1>
    </section>
    <section class="mt-20" style="padding:0 50px">
      <el-button @click="createVisible = true" type="primary">新建版本</el-button>
      <el-table
        :data="data"
        border
        class="mt-30"
        style="width: 100%">
        <el-table-column
          prop="versionNum"
          label="版本号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="prompt"
          label="更新提示语"
          width="180">
        </el-table-column>
        <el-table-column
          prop="forced"
          label="强制更新">
          <template slot-scope="scope">
           <span>{{forcedText(scope.row.forced)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="systemType"
          label="操作系统">
          <template slot-scope="scope">
           <span>{{scope.row.systemType == 1 ? 'android' : 'ios'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道">
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
    </section>
    <!-- 新建版本弹窗 -->
    <el-dialog
      title="新建版本"
      :visible="createVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="createClose">
      <div>
        <el-form :model="dto" :rules="rules" ref="dto" label-width="150px" class="form">
          <el-form-item label="版本号" prop="versionNum">
            <el-input v-model="dto.versionNum" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="是否强制更新" prop="forced">
            <el-radio-group v-model="dto.forced">
              <el-radio label="1">强制更新</el-radio>
              <el-radio label="0">非强制更新</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="更新提示语（内容）" prop="prompt">
            <el-input v-model="dto.prompt" type="textarea" placeholder="请输入更新提示语（内容）"></el-input>
          </el-form-item>
          <el-form-item label="操作系统" prop="systemType">
            <el-radio-group v-model="dto.systemType">
              <el-radio label="1">Android</el-radio>
              <el-radio label="2">ios</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上次APK" prop="name">
            <el-upload
              :action="postUrl+'/admin/upload/files'"
              accept=".apk,.APK"
              class="upload-demo"
              :on-progress="handleProgress"
              :on-error="handleError"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :limit="1"
              :file-list="fileList">
              <el-button :loading="uploadLoading" size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传APK文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="下载地址" prop="downloadUrlApk">
            <el-input :disabled="fileList.length != 0" v-model="dto.downloadUrlApk" placeholder="请输入下载地址"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer flex flex-center">
        <el-button @click="createClose">取 消</el-button>
        <el-button :loading="createLoading" type="primary" @click="createSubmit">提交</el-button>
      </span>
    </el-dialog>
    <!-- 新建版本弹窗 -->
    <!-- 版本详情弹窗 -->
    <el-dialog
      title="版本详情"
      :visible="readVisible"
      width="40%"
      :close-on-click-modal="false"
      :before-close="readClose">
      <div v-loading="detailLoading">
        <el-form ref="form" label-width="150px" class="form">
          <el-form-item label="版本号">
            <span>{{detailData.versionNum}}</span>
          </el-form-item>
          <el-form-item label="更新提示语（内容）">
            <span>{{detailData.prompt}}</span>
          </el-form-item>
          <el-form-item label="强制更新">
            <span>{{detailData.forced ? forcedText(detailData.forced) : '无'}}</span>
          </el-form-item>
          <el-form-item label="操作系统">
            <span>{{detailData.systemType === 1 ? 'android' : 'ios'}}</span>
          </el-form-item>
          <!-- <el-form-item label="地址">
            <span>{{detailData.downloadUrl}}</span>
          </el-form-item> -->
          <el-form-item label="APK地址">
            <span>{{detailData.downloadUrlApk}}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer flex flex-center">
        <el-button  type="primary" @click="readVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 版本详情弹窗 -->
  </section>
</template>
<script>
// @ is an alias to /src
import { API } from '../../plugins/api.js';
import { baseUrl, downUrl } from '../../plugins/config.js';
export default {
  name: "versionsManage",
  components: {
  },
  data(){
    return {
     data: [],
      total: 0,
      page: 1,
      limit: 50,
      readVisible: false,
      createVisible: false,
      createLoading: false,
      dto: {
        versionNum: '',
        forced: '',
        systemType: '',
        downloadUrl: '',
        downloadUrlApk: '',
        prompt: '',
      },
      rules: {
        versionNum: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
        ],
        forced: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        systemType: [
          { required: true, message: '请选择操作系统', trigger: 'change' },
        ],
        downloadUrl: [
          { required: true, message: '请输入输入下载地址', trigger: 'blur' },
        ],
        downloadUrlApk: [
          { required: true, message: '请输入上传Apk或者输入apk下载地址', trigger: 'change' },
        ],
        prompt: [
          { required: true, message: '请输入更新提示语', trigger: 'blur' },
        ],
      },
      fileList: [],
      postUrl:'',
      detailData:{},
      detailLoading:false,
      uploadLoading:false,
    };
  },
  mounted(){
    this.postUrl = baseUrl();
    this.getList();
  },
  methods:{
    getList(){
      const list = {
        currentPage:this.page,
        pageSize:this.limit
      }
      try{
        this.axios.post(API.getVersionHistoryRecord,list).then((res) => {
            if(res.code === '10000'){
              this.data = res.data;
              this.total = Number(res.total);
            }
        })
      }catch(e){

      }      
    },
    handleProgress(event, file, fileList) {
      this.uploadLoading = true;
    },
    handleError(){
      this.uploadLoading = false;
    },
    handleExceed(){
      this.$message.warning('只允许上传一个apk文件')
    },
    handleSuccess(response, file, fileList){
      this.dto.downloadUrlApk = downUrl + response.data;
      this.uploadLoading = false;
    },
    handleRemove(){
      this.dto.downloadUrlApk = '';
    },
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList()
    },
    handleCurrentChange(val) {
      this.limit = 50;
      this.page = val;
      this.getList()    
    },
    // 新建弹窗关闭
    createClose(){
      this.createVisible = false;
      this.createLoading = false;
      this.$refs['dto'].resetFields();
      this.fileList = [];
      this.dto.downloadUrlApk = '';
    },
    // 详情弹窗关闭
    readClose(){
      this.readVisible = false;
    },
    // 新建版本 提交
    createSubmit(){
      this.$refs['dto'].validate((valid) => {
        if (valid) {
          this.createLoading = true;
          try{
            this.axios.post(API.addNewVersion,this.dto).then((res) => {
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
    // 查看
    handleClick(row) {
      this.readVisible = true;
      this.detailLoading = true;
      const list = {
        id: row.id
      }
      try{
          this.axios.post(API.getVersionDetail,list).then((res) => {
            if(res.code === '10000'){
              this.detailData = res.data;
              this.detailLoading = false;
            }
          })
        }catch(e){
          console.log(e)
        }
    },
    forcedText(str){
      if(str == '-1'){
        return '非强制更新弱提示'
      }else if(str == 0){
        return '非强制更新强提示'
      }else if(str == 1){
        return '强制更新'
      }else{
        return '无'
      }
    }
  }
};
</script>
<style lang="stylus">
.versions-manage
  h1
    border-bottom 1px solid #eee
    padding 10px 0
    margin 0 20px
</style>
