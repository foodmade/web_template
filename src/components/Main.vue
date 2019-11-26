/*
 * @Description: 登录后主页面组件
 * @Author: cb
 * @Date: 2018-07-21 16:11:42
 * @Last Modified by: zhegu
 * @Last Modified time: 2019-06-28 17:19:42
 */
<template>
  <section class="main flex flex-column">
    <section>
      <headContainer></headContainer>
    </section>
    <section class="flex flex-1 flex-row">
      <section class="aside">
        <AsideMenu></AsideMenu>
      </section>
      <section class="content">
        <router-view />
      </section>
    </section>
  </section>
</template>

<script>
import AsideMenu from "./AsideMenu.vue";
import headContainer from "./Header.vue";
export default {
  name: "mainContainer",
  components: {
    AsideMenu,
    headContainer
  }
};
</script>

<style scoped lang="stylus">
.main
  display flex
  height 100%
  .content
    flex 1
    box-shadow 0 0 30px #ccc
    margin 15px
    padding-bottom 20px
    min-width 800px
    overflow scroll
    overflow-y auto
    overflow-x auto
    &::-webkit-scrollbar /*滚动条整体样式*/
      width 5px   /*高宽分别对应横竖滚动条的尺寸*/
      height 10px
</style>
