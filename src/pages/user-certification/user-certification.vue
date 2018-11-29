<template>
  <div class="user-main">
    <div class="user-main-content">
      <div class="certification-content">
        <div class="user-main-title" v-if="certificateInfo.is_certificate">
            <span class="title">认证成功</span>
        </div>
        <div class="cer-success" v-if="certificateInfo.is_certificate">
            <div class="personal" v-if="certificateInfo.certificate_info.certificate_type == 1">
                <div class="cer-success-item">
                    <span class="name">认证类型</span>
                    <span class="value">个人认证</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">身份证姓名</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_name}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">身份证号码</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_number}}</span>
                </div>
            </div>
            <div class="company" v-if="certificateInfo.certificate_info.certificate_type == 2">
                <div class="cer-success-item">
                    <span class="name">认证类型</span>
                    <span class="value">企业认证</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">企业名称</span>
                    <span class="value">{{certificateInfo.certificate_info.company_name}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">营业执照号码</span>
                    <span class="value">{{certificateInfo.certificate_info.business_number}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">运营者姓名</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_name}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">身份证号码</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_number}}</span>
                </div>
            </div>
            <div class="media" v-if="certificateInfo.certificate_info.certificate_type == 3">
                <div class="cer-success-item">
                    <span class="name">认证类型</span>
                    <span class="value">媒体认证</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">组织名称</span>
                    <span class="value">{{certificateInfo.certificate_info.company_name}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">营业执照号码</span>
                    <span class="value">{{certificateInfo.certificate_info.business_number}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">运营者姓名</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_name}}</span>
                </div>
                <div class="cer-success-item">
                    <span class="name">身份证号码</span>
                    <span class="value">{{certificateInfo.certificate_info.identification_card_number}}</span>
                </div>
            </div>
        </div>
        <div class="cer-fail" v-if="!certificateInfo.is_certificate">
            <div v-if="- certificateInfo.certificate_status && !certificateInfo.is_delete">
                <p class="text"><i class="icon-notice"></i>很抱歉，认证失败，请修改后重新提交</p>
                <div class="again" @click="again">重新认证</div>
            </div>
        </div>
      </div>
      <div class="certification-content" v-if="!certificateInfo.is_certificate">
          <div v-if="!certificateInfo.certificate_status || certificateInfo.is_delete">
              <div class="cer-content-title">
                  <div class="progress" :class="{'current-progress': currentStep > 0}">
                      <span class="span-one">1</span>
                  </div>
                  <div class="progress" :class="{'current-progress': currentStep > 1}">
                      <i class="line"></i>
                      <span class="span-two">2</span>
                  </div>
                  <div class="progress" :class="{'current-progress': currentStep > 2}">
                      <i class="line"></i>
                      <span class="span-two">3</span>
                  </div>
              </div>
              <div class="cer-content-title">
                  <p class="p-one" :class="{'currentP': currentStep > 0}">认证类型</p>
                  <p class="p-two" :class="{'currentP': currentStep > 1}">认证资料</p>
                  <p class="p-three" :class="{'currentP': currentStep > 2}">等待审核</p>
              </div>
              <div class="one-wrapper" v-show="currentStep === 1">
                <div class="cer-item" v-for="(item, index) in cerInfo" :key="index">
                  <span>{{item.name}}</span>
                  <p>{{item.description}}</p>
                  <a class="cer-submit" @click="selectItem(index)">立即申请</a>
                </div>
              </div>
              <div class="two-wrapper" v-show="currentStep === 2">
                <div class="title" @click="toStepOne">
                  <i class="icon-backward"></i><span>返回上一步</span>
                </div>
                <div class="cer-info-form" v-if="currentItem === 0">
                    <cer-form @submit="getCerInfo" :cerType="1" :isCompany="false"></cer-form>
                </div>
                <div class="cer-info-form" v-if="currentItem === 1">
                    <cer-form @submit="getCerInfo" :cerType="2"></cer-form>
                </div>
                <div class="cer-info-form" v-if="currentItem === 2">
                    <cer-form @submit="getCerInfo" :cerType="3"></cer-form>
                </div>
              </div>
              <div class="wait-wrapper" v-show="currentStep === 3">
                  <p>已经收到您的认证申请，预计在2个工作日内完成审核，请您耐心等待</p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import CerForm from '../../components/cer-form/cer-form'
import {postApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      certificateInfo: [],
      currentStep: 1,
      currentItem: Number,
      cerInfo: [
        {
          name: '个人',
          description: '适合行业专家、意见领袖、评论家及自媒体人士申请。'
        },
        {
          name: '企业',
          description: '适合企业、公司，分支机构，企业相关品牌，产品与服务等。'
        },
        {
          name: '媒体',
          description: '适合各类媒体及有新闻资质的网站等内容生产公司/机构申请。'
        }
      ],
      cardFront: '',
      cardBehind: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
    this.getCerInfo()
  },
  methods: {
    getCerInfo () {
      postApi('user.getCertificateStatus', {
        session: this.userInfo.data.session || this.userInfo.data.data.session
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.certificateInfo = res.data.data
          if (this.certificateInfo.certificate_status === 0) {
            this.currentStep = 3
          }
        }
      })
    },
    selectItem (index) {
      this.currentItem = index
      this.currentStep = 2
    },
    toStepOne () {
      this.currentStep = 1
    },
    again () {
      postApi('user.certificateDelete', {
        session: this.userInfo.data.session || this.userInfo.data.data.session
      }).then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.getCerInfo()
        }
      })
    },
    addCardFront () {
      let file = this.$refs.cardFront.files[0]
      this.cardFront = this.getObjectURL(file)
    },
    addCardBehind () {
      let file = this.$refs.cardBehind.files[0]
      this.cardBehind = this.getObjectURL(file)
    },
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  },
  components: {
    'cer-form': CerForm
  }
}
</script>
<style lang="stylus">
.certification-content
  width: 732px
  .cer-content-title
    display: flex
    text-align: center
    &:nth-child(1)
      margin-top: 40px
    &:nth-child(2)
      margin-bottom: 80px
    .progress
      font-size: 0
      &.current-progress
        .line, span
          background-color: #1f8bee
      .line
        display: inline-block
        width: 261px
        height: 2px
        margin: 14px 0
        background-color: #d9d9d9
      .span-one,.span-two,.span-three
        display: inline-block
        width: 30px
        height: 30px
        margin: 0 20px
        line-height: 30px
        font-size: 14px
        vertical-align: top
        border-radius: 50%
        background-color: #d9d9d9
        color: #fff
    p
      width: 70px
      line-height: 30px
      color: #a8a8a8
      &.p-two
        margin: 0 261px
      &.currentP
        color: #1f8bee
  .one-wrapper
    display: flex
    justify-content: space-between
    text-align: center
    .cer-item
      p
        width: 200px
        text-align: left
        color: #a8a8a8
        margin: 24px 0 40px 0
      span
        line-height: 24px
        font-size: 24px
        color: #393a4c
    .cer-submit
      display: inline-block
      padding:10px 14px
      line-height: 14px
      font-size: 14px
      border-radius: 3px
      background-color: #1f8bee
      color: #fff
      cursor: pointer
  .two-wrapper
    position relative
    .title
      position absolute
      top 0
      right 0
      display flex
      align-items center
      height 30px
      font-size 14px
      color #888
      cursor pointer
      &:hover
        color #1f8bee
      .icon-backward
        margin-right 4px
        font-size 16px

  .wait-wrapper
    p
      font-size: 16px
      text-align: center
      color: #888
      padding-top: 110px
      background: url(cer-waitBg.png) no-repeat center top
  .cer-success
    margin-top 70px
    .cer-success-item
      display flex
      height: 50px
      .name
        width: 150px
        color: #888
      .value
        flex 1
        color: #393a4c
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
        margin-right 4px
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
</style>
