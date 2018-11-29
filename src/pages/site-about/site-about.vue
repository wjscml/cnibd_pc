<template>
<div class="about">
  <div v-html="content"></div>
</div>
</template>
<script>
import {postApi} from '../../api/getApi'
import {htmlDecode} from '../../common/js/htmlUtil.js'

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
      postApi('site.about').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.content = htmlDecode(res.data.data.content)
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.about
  .img-content
    width: 100%
    min-width: 1000px
    height: 300px
    margin-top: 1px
    background: url(./about-bg.png) no-repeat center
  .main
    width: 100%
    min-width: 1000px
    background: url(./about-content-bg.png) no-repeat top center
    background-color: #fff
    .mainBox
      width: 1000px
      margin:0 auto
      overflow: hidden
      min-height: 420px
      .about-content
        padding: 10px 0 40px 0
        p
          margin-bottom: 30px
          line-height: 24px
          font-size: 16px
          color: #363636
          &.title
            font-weight: bold
            margin-top: 70px
            line-height: 18px
            padding-left: 10px
            border-left: 3px solid #1f8bee
</style>
