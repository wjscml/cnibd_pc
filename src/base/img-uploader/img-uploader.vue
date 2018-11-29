<template>
  <div class="cer-info-item">
    <span class="cer-info-name">{{title}}</span>
    <div class="cer-info-img">
        <a class="cer-info-img-box">
            <img :src="imgUrl" v-show="imgUrl">
            <div class="cer-info-img-mask">
              <span>上传图片</span>
              <input class="file" v-validate="'image|size:1024'" data-vv-as="file" name="image_field" type="file" accept="image/png,image/gif,image/jpeg" @change="uploading($event)">
            </div>
        </a>
        <p>支持1M内的的jpg、png、gif图片</p>
    </div>
    <span class="error" v-show="errors.has('image_field')">{{errors.first('image_field')}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    imgUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    uploading ($event) {
      let file = event.target.files[0]
      this.$validator.validateAll().then(res => {
        if (res) {
          this.$emit('file', file)
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.cer-info-img
  display: inline-block
  .cer-info-img-box
    display: inline-block
    position: relative
    border:1px dashed #d9d9d9
    width: 220px
    height: 130px
    background url(./cer-info-imgBg.png) no-repeat center
    background-color #fff
    img
      width: 220px
      height: 130px
    .cer-info-img-mask
      display: none
      position: absolute
      width: 100%
      height: 100%
      line-height: 130px
      left: 0
      top:0
      text-align: center
      background-color: rgba(0,0,0,0.4)
      color: #fff
      input
        position absolute
        left 0
        top 0
        width 100%
        height 130px
        outline none
        opacity 0
        cursor pointer
    &:hover
      background #f8f8f8
      .cer-info-img-mask
        display: block
  p
    line-height: 14px
    margin 14px 0 0 4px
    color: #a8a8a8
</style>
