<template>
  <div class="ranking-con">
    <ul v-for="(ranking, index) in rankingNews" :key="index" v-if="index<num">
        <li class="ranking-number">{{index+1}}</li>
        <li class="ranking-text">
            <router-link :to="`/site/${ranking.id}`" class="title">{{ranking.title}}</router-link>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    rankingNews: {},
    num: Number
  }
}
</script>
<style lang="stylus">
.ranking-con
  ul
    display flex
    margin-bottom: 16px
    li
      line-height: 22px
      &.ranking-number
        width: 18px
        margin-right:8px
        font-size:16px
        color: #888
        text-align: center
        font-family: wenquanyi micro hei,\5FAE\8F6F\96C5\9ED1!important
      &.ranking-text
        flex 1
        .title
          font-size: 14px
          color: #393a4c
          &:hover
            color: #1f8bee
    &:nth-child(1),&:nth-child(2),&:nth-child(3)
      .ranking-number
        color:red
</style>
