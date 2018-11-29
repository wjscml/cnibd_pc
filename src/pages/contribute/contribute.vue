<template>
<div class="contribute">
  <div class="mainBox">
    <div class="editor-main">
        <div class="title">
            <textarea id="title" maxlength="40" placeholder="请输入标题" v-model="title" v-validate="'required'" name="title"></textarea>
            <span class="tips-wrap"><a class="tips">{{40 - titleLen}}</a>/40</span>
        </div>
        <span class="error" v-show="errors.has('title')">{{errors.first('title')}}</span>
        <div class="preface">
            <textarea type="text" id="preface" rows="3" maxlength="135" placeholder="导语" v-model="preface" v-validate="'required'" name="preface"></textarea>
            <span class="tips-wrap"><a class="tips">{{135 - prefaceLen}}</a>/135</span>
        </div>
        <span class="error" v-show="errors.has('preface')">{{errors.first('preface')}}</span>
        <div class="class">
            <span class="class-title">分类：</span>
            <div class="class-list">
                <label class="class-list-item" :for="index" v-for="(item, index) in classList" :key="index">
                  <input type="radio" :id="index" v-model="cid" :value="item.id" v-validate="'required'" name="cid">
                  <i class="icon-square_check_fill"></i>
                  <i class="icon-square"></i>
                  <span class="value">{{item.name}}</span>
                </label>
            </div>
        </div>
        <span class="error" v-show="errors.has('cid')">{{errors.first('cid')}}</span>
        <div class="editor">
            <div ref="editorBar" class="toolbar"></div>
            <div ref="editorElem" class="text"></div>
            <span class="error" v-show="errors.has('content')">{{errors.first('content')}}</span>
        </div>
        <uploader title="上传配图" :imgUrl="imgUrl" @file="getThumb"></uploader>
    </div>
    <div class="editor-footer">
        <div class="footer-wrap">
            <p class="submit-error" v-show="isError"><i class="icon-notice"></i><a>{{errorTips}}</a></p>
            <span class="state" @click="toSubmit(0)"><a>保存草稿</a></span>
            <span class="submit" @click="toSubmit(1)"><a>提交审核</a></span>
        </div>
    </div>
    <confirm :hasCancel="false" :text="confirmTxt" cancelBtnText="确定" ref="confirm" id="confirm"></confirm>
  </div>
</div>
</template>

<script>
import E from 'wangeditor'
import Uploader from '../../base/img-uploader/img-uploader'
import Confirm from '../../components/confirm/confirm'
import {getObjectURL} from '../../common/js/htmlUtil'
import {postApi, postFileApi} from '../../api/getApi'
import {mapGetters} from 'vuex'

const ERR_OK = '0'
export default {
  data () {
    return {
      imgUrl: '',
      title: '',
      preface: '',
      cid: '',
      classList: [],
      thumb: '',
      isError: null,
      errorTips: '',
      confirmTxt: '',
      editorContent: ''
    }
  },
  computed: {
    titleLen () {
      return this.title.length
    },
    prefaceLen () {
      return this.preface.length
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted () {
    this.refreshEditor()
  },
  created () {
    this.getClassList()
  },
  methods: {
    isFileError () {
      if (!this.imgUrl) {
        return false
      }
      return true
    },
    toSubmit (type) {
      this.$validator.validateAll().then(res => {
        if (res) {
          if (this.isFileError() && this.editorContent !== '') {
            this.isError = false
            this.submit(type)
          } else {
            this.isError = true
            if (!this.editorContent) {
              this.errorTips = '请填写文章正文'
            } else if (!this.isFileError()) {
              this.errorTips = '请上传配图'
            }
          }
        }
      })
    },
    submit (type) {
      let formData = new FormData()
      formData.append('session', this.userInfo.data.session || this.userInfo.data.data.session)
      formData.append('title', this.title)
      formData.append('summary', this.preface)
      formData.append('cid', this.cid)
      formData.append('content', this.editorContent)
      formData.append('UserContributions[thumb]', this.thumb)
      formData.append('submitType', type)
      postFileApi('user.submission', formData).then(res => {
        this.showConfirm()
        if (type === 0) {
          this.confirmTxt = '保存草稿成功，可在个人中心预览'
        }
        if (type === 1) {
          this.confirmTxt = '提交审核成功，可在个人中心查看审核状态'
        }
      })
    },
    getClassList () {
      postApi('article.categories').then(res => {
        if (res.data.errorCode === ERR_OK) {
          this.classList = res.data.data.slice(1)
        }
      })
    },
    getThumb (val) {
      this.thumb = val
      this.imgUrl = getObjectURL(val)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    focus () {
      this.isEditor = true
    },
    refreshEditor () {
      var editor = new E(this.$refs.editorBar, this.$refs.editorElem)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('html', this.editorContent)
      }
      editor.customConfig.uploadImgServer = 'https://api.cnibd.com/site/index?method=user.submissionUpload&format=json'
      editor.customConfig.uploadFileName = 'contribution_img'
      editor.customConfig.menus = [
        'head',
        'bold',
        'italic',
        'underline',
        'fontSize',
        'foreColor',
        'list',
        'justify',
        'quote',
        'image',
        'undo',
        'redo'
      ]
      editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          var url = result.data
          insertImg(url)
        },
        before: function (xhr, editor, files) { // 图片上传之前触发
          console.log(xhr, editor, files)
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //   prevent: true,
          //   msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) { // 图片上传并返回结果，图片插入成功之后触发
          console.log(result)
        },
        fail: function (xhr, editor, result) { // 图片上传并返回结果，但图片插入错误时触发
          console.log(xhr, editor, result)
        },
        error: function (xhr, editor) { // 图片上传出错时触发
          console.log(xhr, editor)
        },
        timeout: function (xhr, editor) { // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        }
      }
      editor.customConfig.onfocus = function () {
        editor.txt.clear()
      }
      editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
      editor.customConfig.pasteFilterStyle = false
      editor.create()
    }
  },
  components: {
    'uploader': Uploader,
    'confirm': Confirm
  }
}
</script>

<style lang="stylus">
.contribute
  position: fixed
  top:0
  bottom 0
  left 0
  right 0
  z-index 100
  background-color #f8f8f8
  .mainBox
    overflow-y auto
    height 100%
    width: 800px
    margin: 40px auto
    background: #fff
    border: 1px solid #d0d0d0
    box-shadow:0 0 2px #d0d0d0
    .editor-main
      width 700px
      margin 50px auto 120px
      .title
        position: relative
        font-size: 0
        textarea
          width: 630px
          padding-right: 50px
          height: 100px
          line-height: 50px
          font-size: 30px
          border:none
          box-shadow: none
          outline: none
          resize: none
          color: #000
        .tips-wrap
          position: absolute
          right: 0
          bottom: 10px
          line-height: 14px
          font-size: 14px
          color: #a8a8a8
          .tips
            color:#1f8bee
      .preface
        position: relative
        margin-top 50px
        padding: 12px 30px
        background: #f2f2f2
        textarea
          width: 640px
          line-height: 28px
          height: 84px
          font-size: 14px
          outline: none
          border:none
          background: #f2f2f2
          color:#333
          resize: none
        .tips-wrap
          position: absolute
          right: 0
          bottom: -24px
          line-height: 14px
          font-size: 14px
          color: #a8a8a8
          .tips
            color:#1f8bee
      .class
        margin-top 50px
        padding: 12px 30px
        background: #f2f2f2
        display flex
        align-items center
        height 28px
        .class-title
          color: #808080
        .class-list
          flex 1
          display flex
          .class-list-item
            margin-left 20px
            display flex
            align-items center
            justify-content space-between
            .value
              margin-left 4px
              color: #333
            .icon-square
              font-size 18px
              color #1f8bee
            .icon-square_check_fill
              display none
              font-size 18px
              color #1f8bee
            input
              display none
              &:checked + .icon-square_check_fill
                display inline
                & + .icon-square
                  display none
      .cer-info-item
        margin-top 50px
        .cer-info-name
          display: block
          margin-bottom 20px
          line-height 18px
          font-size 18px
          color #808080
        .cer-info-img
          display: block
      .editor
        position: relative
        margin-top 50px
        .toolbar
          background-color #f2f2f2
        .text
          min-height: 300px
          border 1px solid #f2f2f2
          color: #333
      .error
        margin-left 4px
        color #ff0000
    .editor-footer
      position: fixed
      bottom:0
      left: 0
      width: 100%
      background-color #f2f2f2
      border-top: 1px solid #d0d0d0
      box-shadow:0 -1px 0 #dedee1
      z-index: 10001
      .footer-wrap
        display: flex
        justify-content flex-end
        align-items center
        height: 52px
        width: 800px
        margin: 0 auto
        .submit-error
          flex 1
          display flex
          align-items center
          margin-left 4px
          color #ff0000
          .icon-notice
            margin-right 4px
            font-size 20px
        span
          margin-left: 50px
          cursor pointer
          &.state a
            &:hover
              color #1f8bee
          &.submit a
            display: inline-block
            height: 36px
            line-height: 36px
            padding: 0 14px
            border-radius: 3px
            background-color: #1f8bee
            color: #fff
            &:hover
              background-color rgb(22,59,138)

</style>
