import Vue from "vue";
import Router from "vue-router";
// import Home from "./views/Home.vue";

Vue.use(Router);
const Main = () =>
  import(/* webpackChunkName: 'Main' */ "./components/Main.vue");
const Login = () => import(/* webpackChunkName: 'Login' */ "./views/Login.vue");
const UserManage = () => import(/* webpackChunkName: 'UserManage' */ "./views/User/UserManage.vue");
const UserDetail = () => import(/* webpackChunkName: 'UserDetail' */ "./views/User/UserDetail.vue");
const FinancialManage = () =>
  import(
    /* webpackChunkName: 'FinancialManage' */ "./views/Financial/FinancialManage.vue"
  );
const CoinCheck = () =>
  import(
    /* webpackChunkName: 'CoinCheck' */ "./views/Financial/CoinCheck.vue"
  );
const DataStatistics = () =>
  import(
    /* webpackChunkName: 'DataStatistics' */ "./views/Statistics/DataStatistics.vue"
  );
const ParameterManage = () =>
  import(
    /* webpackChunkName: 'ParameterManage' */ "./views/Parameter/ParameterManage.vue"
  );
const VersionsManage = () =>
  import(
    /* webpackChunkName: 'VersionsManage' */ "./views/Parameter/VersionsManage.vue"
  );
const AnnouncementManage = () =>
  import(
    /* webpackChunkName: 'AnnouncementManage' */ "./views/Parameter/AnnouncementManage.vue"
  );
const FixPassWord = () =>
    import(
      /* webpackChunkName: 'FixPassWord' */ "./views/Parameter/FixPassWord.vue"
    )
const H5Register = () =>
  import(
    /* webpackChunkName: 'H5Register' */ "./views/H5Register.vue"
  );
const AreaCode = () =>
  import(
    /* webpackChunkName: 'AreaCode' */ "./views/AreaCode.vue"
  );
export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: Home
    // },
    {
      path: "/",
      redirect: "/index",
      component: Main,
      name: "mainContainer",
      children: [
        { path: "/index", name: "userManage", component: UserManage },
        { path: "/user-detail/", name: "userDetail", component: UserDetail },
        {
          path: "/financialManage",
          name: "financialManage",
          component: FinancialManage
        },
        {
          path: "/coinCheck",
          name: "coinCheck",
          component: CoinCheck
        },
        {
          path: "/dataStatistics",
          name: "dataStatistics",
          component: DataStatistics
        },
        {
          path: "/parameterManage",
          name: "parameterManage",
          component: ParameterManage
        },
        {
          path: "/versionsManage",
          name: "versionsManage",
          component: VersionsManage
        },
        {
          path: "/announcementManage",
          name: "announcementManage",
          component: AnnouncementManage
        },
        {
          path: "/fixPassWord",
          name: "fixPassWord",
          component: FixPassWord
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: "/h5Register",
      name: "h5Register",
      component: H5Register,
      meta: {
        title: "注册",
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: "/areaCode",
      name: "areaCode",
      component: AreaCode,
      meta: {
        title: "国家代码",
        keepAlive: false // 不需要缓存
      }
    },
  ]
});
