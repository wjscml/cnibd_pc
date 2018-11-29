<template>
<div class="instructions">
  <div v-html="content"></div>
</div>
</template>
<script>
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
export default {
  data () {
    return {
      content: ''
    }
  },
  created () {
    this.getAbout()
  },
  methods: {
    getAbout () {
      let pramas = {}
      let pathname = window.location.pathname
      if (pathname === '/notices') {
        pramas = { instruction: '投稿须知' }
      }
      if (pathname === '/copyright') {
        pramas = { instruction: '版权声明' }
      }
      if (pathname === '/agreements') {
        pramas = { instruction: '用户注册协议' }
      }
      postApi('site.getSiteInstructions', pramas).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.content = res.data.data
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.getAbout()
    }
  }
}
</script>
<style lang="stylus">
.instructions
  width: 100%
  min-width: 1000px
  .mainBox
    width: 1000px
    margin:0 auto
    overflow: hidden
    .copy-content
      padding: 70px 100px
      p
        margin-bottom: 30px
        line-height: 24px
        font-size: 16px
        color: #363636
      .title
        margin-bottom: 70px
        line-height: 28px
        font-size: 28px
        text-align: center
        color: #393a4c
</style>
