/*
 * @Description: 侧边栏组件
 * @Author: cb
 * @Date: 2019-06-19 17:05:24
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-07-11 19:53:37
 */
<template>
  <aside class="aside-menu">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="false"
      :unique-opened="false"
    >
      <el-submenu v-for="(item,index) in menus" :key="index" :index="item.index">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>{{item.tit}}</span>
        </template>
        <el-menu-item-group v-for="(child,gindex) in item.child" :key="gindex">
          <el-menu-item @click="toRouter(child)" :index="child.index">{{child.tit}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </aside>
</template>

<script>
export default {
  name: "asideMenu",
  data(){
    return {
      menus:[
        { tit: "用户中心", index: "1", child: [
          { tit: "用户管理", index: "1-1", link: "/index" }
          ]
        },
        { tit: "财务中心", index: "2", child: [
          { tit: "财务管理", index: "2-1", link: "/financialManage" },
          { tit: "提币审核", index: "2-2", link: "/coinCheck" },
          ]
        },
        { tit: "数据中心", index: "3", child: [
          { tit: "数据统计", index: "3-1", link: "/dataStatistics" }
          ]
        },
        { tit: "系统管理", index: "4", child: [
          { tit: "参数管理", index: "4-1", link: "/parameterManage"},
          { tit: "版本管理", index: "4-2", link: "/versionsManage"},
          { tit: "公告管理", index: "4-3", link: "/announcementManage"},
          { tit: "修改密码", index: "4-4", link: "/fixPassWord"},
          ]
        },
      ],
      defaultActive: ""
    }
  },
  mounted(){
    this.defaultActive = sessionStorage.getItem("activeMenu") ? sessionStorage.getItem("activeMenu") : "1-1";
  },
  methods:{
    toRouter(item){
      this.$router.push(item.link);
      this.defaultActive = item.index;
      sessionStorage.setItem("activeMenu", item.index);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.aside
  width 220px
  height 100%
  .aside-menu,ul
    height 100%
    border 0
</style>
