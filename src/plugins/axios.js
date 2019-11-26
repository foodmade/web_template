/*
 * @Description: Axios 二次封装(增加默认配置、请求拦截和响应拦截)
 * @Author: cb
 * @Date: 2019-06-28 14:20:40
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-08-01 17:02:26
 */
import router from '../router.js'
import axios from 'axios';
import qs from 'qs';
import { baseUrl, port } from './config';
import Vue from "vue";
import store from '../store.js'
import { Base64 } from 'js-base64';
const Axios = axios.create({
  timeout: 50000,
  headers: {
    'os_version': port() === 'pc' ? 0 : 3,
    'Content-Type': 'application/x-www-form-urlencoded;'
  }
});
// http request请求拦截器(所有请求发送都要执行的操作)
Axios.interceptors.request.use(
  (config) => {
    // 根据环境设置baseURL
    const list = {
      data: Base64.encode(JSON.stringify(config.data))
    };
    config.baseURL = baseUrl(config);
    config.data = qs.stringify(list);
    config.headers.token = store.state.token;
    if(config.url.indexOf("userManage/downloadChildInvite") != -1 || config.url.indexOf("financeManage/downloadWithdrawList") != -1){
      config.responseType = 'blob'
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

// http response响应拦截器
Axios.interceptors.response.use(
  (response) => {
    // 这里可以做一些响应拦截的操作
    if(response.config && response.config.responseType == 'blob') {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      let filename = 'excel.xls';
      if ('download' in document.createElement('a')) {
        const downloadElement = document.createElement('a');
        let href = ''; 
        if(window.URL) href = window.URL.createObjectURL(blob); 
        else href = window.webkitURL.createObjectURL(blob); 
    　　 downloadElement.href = href;
    　　 downloadElement.download = filename; 
    　　 document.body.appendChild(downloadElement);
    　　 downloadElement.click(); 
        if(window.URL) window.URL.revokeObjectURL(href); 
          else window.webkitURL.revokeObjectURL(href); 
          document.body.removeChild(downloadElement);
        } else {
          navigator.msSaveBlob(blob, filename);
        }
        return;
    }
    if (response.status === 200) {
      if (response.data.code === "10004") {
        // 登录失效
        // localStorage.clear();
        Vue.prototype.$message.error(response.data.message);
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
      return response.data;
    }
  }, (error) => {
    Vue.prototype.$message.error('服务器异常')
    setTimeout(() => {
      router.push('/login');
    }, 1000);
    return Promise.reject(error);
  }
  
);
export default Axios;
