<template>
  <div class="user-main">
    <div class="user-main-content" v-if="isCertificate()">
      <div class="user-main-title">
        <span class="title-nav" v-for="(item, index) in nav" :key="index" :class="{'title-nav-c': currentNav == index}" @click="select(index)">{{item.name}}</span>
      </div>
      <div class="collect">
        <news-column :articleType="currentNav" :news="myArticle" :hasName="false" :hasHot="false"></news-column>
      </div>
    </div>
    <div class="cer-fail" v-if="!isCertificate()">
      <p class="text"><i class="icon-notice"></i>实名认证通过后才能发表或管理文章</p>
      <div class="again" @click="toCertify">实名认证</div>
    </div>
    <div class="no-result-wrapper" v-show="!myArticle.length">
      <i class="icon-no_result"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import NewsColumn from '../../components/newsColumn/newsColumn'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      nav: [
        {name: '草稿'},
        {name: '审核中'},
        {name: '已通过'},
        {name: '未通过'}
      ],
      currentNav: 0,
      myArticle: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    this.getMyArticle()
  },
  methods: {
    isCertificate () {
      if (this.userInfo.data.isCertificate === 1 || this.userInfo.data.data.isCertificate === 1) {
        return true
      }
      return false
    },
    getMyArticle () {
      this.myArticle = []
      postApi('user.getMysubmission', {
        session: this.userInfo.data.session || this.userInfo.data.data.session,
        status: this.currentNav
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.myArticle = res.data.data
          console.log(this.myArticle)
        }
      })
    },
    select (index) {
      this.currentNav = index
      this.getMyArticle()
    },
    toCertify () {
      this.$router.push({path: '/user/certification'})
    }
  },
  components: {
    'news-column': NewsColumn
  }
}
</script>
<style lang="stylus">
.cer-fail
  margin-top:100px
  text-align: center
  .text
    display flex
    align-items center
    justify-content center
    height 50px
    font-size: 16px
    text-align center
    color: #757575
    .icon-notice
      margin-right 6px
      font-size 22px
      color #888
  .again
    display: inline-block
    margin-top: 40px
    padding: 0 12px
    line-height: 36px
    color: #fff
    background-color: #1f8bee
    cursor pointer
.no-result-wrapper
  margin-top 140px
  text-align center
  color #757575
  .icon-no_result
    font-size 120px
    color #bfbfbf
</style>
