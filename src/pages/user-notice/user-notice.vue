<template>
  <div class="user-main">
      <div class="user-main-content">
          <div class="user-main-title">
              <a href="">我的消息</a>
          </div>
          <div class="my-notice">
              <div class="news-col-entry">
                  <div class="news-title">基金新进711只个股 纺织服装等三大板块受宠<span>2018年1月15日 14:26</span></div>
                  <div class="news-main">
                      <div class="news-main-text">
                          美元周一重新企稳，此前受美国政府停摆影响下跌，美债收益率(殖利率)上涨给美元带来支撑，投资者对华盛顿政治僵局的看法也相对淡定。美国政府从周五午夜开始正式关门，此前民主党和共和党未能在最后时刻就拨款问题达成一致。
                      </div>
                  </div>
              </div>
              <div class="news-col-entry">
                  <div class="news-title">基金新进711只个股 纺织服装等三大板块受宠<span>2018年1月15日 14:26</span></div>
                  <div class="news-main">
                      <div class="news-main-text">
                          美元周一重新企稳，此前受美国政府停摆影响下跌，美债收益率(殖利率)上涨给美元带来支撑，投资者对华盛顿政治僵局的看法也相对淡定。美国政府从周五午夜开始正式关门，此前民主党和共和党未能在最后时刻就拨款问题达成一致。
                      </div>
                  </div>
              </div>
              <div class="empty">暂无消息</div>
          </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.collect{width: 732px;}
.news-title span{float: right; color: #999; font-size: 12px;}

.news-col-entry{padding: 24px 0; border-bottom: 1px solid #e0e0e0;}
.news-title{font-size: 20px; color: #393a4c; line-height: 26px; margin-bottom: 14px;}
.news-title a{font-weight: 600;}
.news-title a:hover{color: #1f8bee;}
.news-main{overflow: hidden; position: relative;}
.news-main-img{float: left;}
.news-main-img img{width: 210px; height: 152px;}
.news-main-text{float: left; width: 502px; margin-left: 20px;}
.news-main-text p{color: #666;}
.news-main-info{position: absolute; left:230px; bottom:0; font-size: 0;}
.news-main-info .avatar-small{display: inline-block; vertical-align: top;}
.avatar-small img{border-radius: 12px;}
.news-main-info span{display: inline-block; margin-left: 6px; line-height: 24px; font-size: 14px; color: #a8a8a8;}
.news-main-info a{color: #999;}
.news-main-info a:hover{color: #1f8bee;}
#cancel-collect{position: absolute; right: 10px; bottom:0; color:#f8f8f8; font-size: 14px; line-height: 30px; border:none; text-align: center; cursor: pointer;}
.news-main:hover #cancel-collect{color: #1f8bee;}
.news-more{font-size: 14px; margin: 30px 0; line-height: 14px;text-align: center;}
.news-more a{color: #393a4c;}
.news-more a:hover{color: #1f8bee;}
.empty{color: #a8a8a8; line-height: 100px; font-size: 16px; text-align: center;}
</style>
