<template>
<div class="footer">
  <div class="footerNav">
    <div class="footerNavBox">
      <router-link to="/about" tag="div" class="footerNav-btn">关于我们</router-link>
      <router-link to="/contact" tag="div" class="footerNav-btn">联系我们</router-link>
      <router-link to="/notices" tag="div" class="footerNav-btn">投稿须知</router-link>
      <router-link to="/copyright" tag="div" class="footerNav-btn">版权声明</router-link>
      <router-link to="/agreements" tag="div" class="footerNav-btn">用户协议</router-link>
    </div>
  </div>
  <div class="footerBottom">
    <p><span>Copyright © 2018 The Paper All rights reserved.</span>赛恩财经 | 鲁<span>ICP</span>证：<span>17050841</span>号<span>-1</span></p>
    <!--<p class="gongan"><img src="images/gongan.png">鲁公网安备<span>31010602000299</span>号</p>-->
  </div>
</div>
</template>
<script>
export default {

}
</script>
<style lang="stylus">
.footer
  .footerNav
    width: 100%
    min-width: 1050px
    background-color: #393a4c
    border-bottom: 1px solid #7f7f7f
    .footerNavBox
      width: 640px
      margin: 0 auto
      overflow: hidden
      height: 44px
      .footerNav-btn
        float: left
        width: 128px
        line-height: 44px
        font-size: 14px
        color: #fff
        text-align center
        &:hover
          color:#c4c4c4
          cursor pointer
  .footerBottom
    background-color: #393a4c
    width: 100%
    min-width: 1050px
    p
      line-height: 44px
      text-align: center
      color: #c4c4c4
      font-size: 14px
</style>
