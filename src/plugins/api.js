/*
 * @Description: 接口
 * @Author: cb
 * @Date: 2019-06-28 14:20:21
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-11 19:48:57
 */

export const API = {
  login: "/admin/login", // 登录
  logout: "/admin/logout", // 退出
  // 用户管理
  userList: "/admin/userManage/userDetailList", // 获取用户列表
  updateUserLevel: "/admin/userManage/updateUserLevel", // 修改用户等级
  getUserInviteList: "/admin/userManage/getUserInviteList", // 获取用户邀请列表
  userDetailInfo: "/admin/userManage/userDetailInfo", // 获取用户详情
  getChildStatisticsInfo: "/admin/userManage/getChildStatisticsInfo",  //下级统计信息
  downloadChildInvite: "/admin/userManage/downloadChildInvite", // 下载子代详细信息
  // 财务管理
  getTransactionList: "/admin/financeManage/getTransactionList", //财务管理列表
  getWithdrawList: "/admin/financeManage/getWithdrawList", //提币审核列表
  batchReview: "/admin/financeManage/batchReview ", //批量/单个 提现审核
  reviewDetail: "/admin/financeManage/reviewDetail ", //获取提币审核详情
  downloadWithdrawList: "/admin/financeManage/downloadWithdrawList", //下载流水记录
  tryBatchReview: "/admin/financeManage/tryBatchReview", // 重新发起转账
  
  // 版本管理
  addNewVersion: "/admin/config/addNewVersion", // 添加新版本信息
  getVersionHistoryRecord: "/admin/config/getVersionHistoryRecord", // 获取版本历史记录列表
  getVersionDetail: "/admin/config/getVersionDetail", // 获取版本详细信息
  
  // 公告管理
  getNoticeList: "/admin/config/getNoticeList", // 获取公告列表
  setNoticeInfo: "/admin/config/setNoticeInfo", // 添加公告

  // 全局参数
  getConfiguration: "/admin/config/getConfiguration", // 获取全局配置
  configuration: "/admin/config/configuration", // 修改全局配置参数

  //数据统计
  getTodayStatisticsInfo: "/admin/statistics/getTodayStatisticsInfo", // 获取每日平台汇总信息
  updateStatistics: "/admin/statistics/updateStatistics", // 更新数据统计

  // 修改密码
  updatePassword: "/admin/updatePassword", // 修改密码
  // h5 短信验证
  sendSmsCode: "/common/sendSmsCode", // 短信验证

  sendEmailCode: "/common/sendEmailCode", //邮箱注册

  // h5 注册
  h5Register: "/user/register" // h5注册
};
