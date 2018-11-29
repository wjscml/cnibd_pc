<template>
  <div id="app" v-wechat-title="$route.meta.title">
    <div class="app-wrapper">
      <div class="app-content">
        <v-header></v-header>
        <v-nav></v-nav>
        <router-view></router-view>
      </div>
    </div>
    <div class="app-footer">
      <v-footer></v-footer>
    </div>
  </div>
</template>
<script>
import Header from './components/header/header.vue'
import Nav from './components/nav/nav.vue'
import Footer from './components/footer/footer.vue'
export default {
  components: {
    'v-header': Header,
    'v-nav': Nav,
    'v-footer': Footer
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "common/css/neat.css"
@import "common/stylus/index.styl"
html,body
  height 100%
  background-color #f8f8f8
  #app
    height 100%
    .app-wrapper
      min-height 100%
      .app-content
        padding-bottom 89px
      .app-footer
        margin-top -89px
</style>
