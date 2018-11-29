<template>
<div class="user-article-detail" v-wechat-title="newsDetails.title">
  <div class="mainBox">
    <div class="detail-header">
        <h1 class="title-box">{{newsDetails.title}}</h1>
        <div class="issue-box">
            <p class="cid">分类：{{classname}}</p>
            <p class="time">发布时间：<span>{{newsDetails.create_time}}</span></p>
        </div>
    </div>
    <div class="detail-content" v-html="content"></div>
  </div>

</div>
</template>

<script>
import {postApi} from '../../api/getApi'
import {removeNull} from '../../common/js/htmlUtil'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      classname: {},
      newsDetails: [],
      content: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      postApi('user.getSubmissionContent', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        contributionId: this.$route.params.id
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.newsDetails = res.data.data
          this.content = removeNull(res.data.data.content)
          this.$nextTick(() => {
            this.getClassList()
          })
        }
      })
    },
    getClassList () {
      postApi('article.categories').then(res => {
        if (res.data.errorCode === ERR_OK) {
          let classList = res.data.data.slice(1)
          this.classname = classList[this.newsDetails.cid - 1].name
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.user-article-detail
  position: fixed
  top:0
  bottom 0
  left 0
  right 0
  padding 40px 0
  z-index 10003
  background-color #f8f8f8
  .mainBox
    overflow-y auto
    height 100%
    width: 800px
    margin: 0 auto
    padding 0 50px
    background: #fff
    border: 1px solid #d0d0d0
    box-shadow:0 0 2px #d0d0d0
    .detail-header
      margin-top 40px
      .title-box
        font-size: 28px
        line-height: 38px
        font-weight: 600
        color: #393a4c
      .issue-box
        display flex
        align-items center
        justify-content space-between
        overflow: hidden
        margin-top: 20px
        border-bottom: 1px solid #e0e0e0
        height: 40px
        font-size: 14px
        color: #999
        .cid
          flex 1
    .detail-content
      margin: 24px 0
      p
        font-size: 16px
        line-height: 32px
        color: #363636
        margin-bottom: 14px
      h2,h3,h4,h5
        margin 20px 0
        font-size: 20px
        font-weight: 600
</style>
