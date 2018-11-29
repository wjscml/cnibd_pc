<template>
  <div class="nav" :class="{'navFixed': isFixed}" ref="navWrapper">
      <div class="navBar">
        <router-link :to="`/news/${item.id}`" v-for="(item, index) in nav" :key="index" class="navBtn" active-class="navBtn-s" :class="{'navBtn-index': isIndex}">{{item.name}}
        </router-link>
      </div>
      <div class="menu">
        <div class="menu-list" v-for="(item, index) in nav" :key="index">
          <!--<router-link to="" v-for="(subitem,index) in item.subnav" :key="index">{{subitem.subtitle}}</router-link>-->
        </div>
      </div>
  </div>
</template>

<script>
import {postApi} from '../../api/getApi'

const ERR_OK = '0'
const first = [{id: 0, name: '首页'}]
export default {
  data () {
    return {
      isIndex: null,
      nav: [],
      isFixed: null
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  created () {
    this.getNav()
  },
  methods: {
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var offsetTop = this.$refs.navWrapper.offsetTop
      if (scrollTop > offsetTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    getNav () {
      postApi('article.categories').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.nav = first.concat(res.data.data.slice(1))
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.path === '/index') {
        this.isIndex = true
      } else {
        this.isIndex = false
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="stylus">
.nav
  width: 100%
  min-width: 1050px
  margin-bottom:4px
  background-color: #f8f8f8
  border-top:1px solid #f0f0f0
  box-shadow: 0 2px 4px 0 rgba(72, 72, 72, 0.21)
  z-index:1
  &.navFixed
    position fixed
    top 0
  .navBar
    width: 1050px
    margin: 0 auto
    font-size: 0
    .navBtn
      display: inline-block
      width: 110px
      height: 44px
      line-height: 44px
      font-size: 15px
      cursor pointer
      outline none
      text-align: center
      color: #393a4c
      &:hover
        color #fff
      &:nth-child(12)
        &:hover
          background-color:#2fbde1
      &:nth-child(11)
        &:hover
          background-color:rgb(213,160,63)
      &:nth-child(10)
        &:hover
          background-color:rgb(72,169,165)
      &:nth-child(9)
        &:hover
          background-color:rgb(232,72,23)
      &:nth-child(8)
        &:hover
          background-color:rgb(160,55,127)
      &:nth-child(7)
        &:hover
          background-color:#048479
      &:nth-child(6)
        &:hover
          background-color:rgb(9,172,248)
      &:nth-child(5)
        &:hover
          background-color:rgb(251,173,43)
      &:nth-child(4)
        &:hover
          background-color:#bf2709
      &:nth-child(3)
        &:hover
          background-color:rgb(145,69,37)
      &:nth-child(2)
        &:hover
          background-color:rgb(9,122,201)
      &:nth-child(1)
        &:hover
          background-color:rgb(22,59,138)
    .navBtn-s
      color #fff
      &:nth-child(12)
        background-color:#2fbde1
      &:nth-child(11)
        background-color:rgb(213,160,63)
      &:nth-child(10)
        background-color:rgb(72,169,165)
      &:nth-child(9)
        background-color:rgb(232,72,23)
      &:nth-child(8)
        background-color:rgb(160,55,127)
      &:nth-child(7)
        background-color:#048479
      &:nth-child(6)
        background-color:rgb(9,172,248)
      &:nth-child(5)
        background-color:rgb(251,173,43)
      &:nth-child(4)
        background-color:#bf2709
      &:nth-child(3)
         background-color:rgb(145,69,37)
      &:nth-child(2)
        background-color:rgb(9,122,201)
      &:nth-child(1)
        background-color:rgb(22,59,138)
    .navBtn-index
      &:nth-child(1)
        color #fff
        background-color:rgb(22,59,138)
  .menu
    position: absolute
    width:100%
    bottom:-40px
    text-align: center
    background-color: #f8f8f8
    z-index: 50;
    .menu-list
      a
        display: inline-block
        margin:0 10px
        line-height: 36px
        height: 36px
        font-size: 14px
        color: #393a4c
      &:nth-child(12)a:hover
        color:#2fbde1
      &:nth-child(11) a:hover
        color:rgb(213,160,63)
      &:nth-child(10) a:hover
        color:rgb(72,169,165)
      &:nth-child(9) a:hover
        color:rgb(232,72,23)
      &:nth-child(8) a:hover
        color:rgb(160,55,127)
      &:nth-child(7) a:hover
        color:#048479
      &:nth-child(6) a:hover
        color:rgb(9,172,248)
      &:nth-child(5) a:hover
        color:rgb(251,173,43)
      &:nth-child(4) a:hover
        color:#bf2709
      &:nth-child(3) a:hover
        color:rgb(145,69,37)
      &:nth-child(2) a:hover
        color:rgb(9,122,201)
      &:nth-child(1) a:hover
        color:rgb(22,59,138)
      &:before
        content: ""
        position: absolute
        left: 0
        top: -5px
        width: 100%
        height: 6px
</style>
