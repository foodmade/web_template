/*
 * @Description: 根据环境配置URL
 * @Author: cb
 * @Date: 2019-06-28 14:20:21
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-09-06 11:37:35
 */
export const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {   // 生产
    return 'http://39.98.165.155:9008';
  } else {
    /** 测试数据库 */
    return 'http://39.98.165.155:9008';
  }
};
export const downUrl = "https://cassembly.s3.ap-east-1.amazonaws.com/";

export const port = () => {
  var u = navigator.userAgent, app = navigator.appVersion; 
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(isiOS){
    return 'ios'
  }else if(isAndroid){
    return 'android'
  }else{
    return 'pc'
  }
}
