import Vue from 'vue'
import Router from 'vue-router'

import NotFound from '../pages/not-found/not-found.vue'

Vue.use(Router)

const Index = (resolve) => {
  import('../pages/index/index.vue').then((module) => {
    resolve(module)
  })
}
const WxLogin = (resolve) => {
  import('../pages/wx-login/wx-login.vue').then((module) => {
    resolve(module)
  })
}
const Login = (resolve) => {
  import('../pages/login/login.vue').then((module) => {
    resolve(module)
  })
}
const Register = (resolve) => {
  import('../pages/register/register.vue').then((module) => {
    resolve(module)
  })
}
const Forget = (resolve) => {
  import('../pages/forget/forget.vue').then((module) => {
    resolve(module)
  })
}
const User = (resolve) => {
  import('../pages/user/user.vue').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('../pages/user-center/user-center.vue').then((module) => {
    resolve(module)
  })
}
const UserCollect = (resolve) => {
  import('../pages/user-collect/user-collect.vue').then((module) => {
    resolve(module)
  })
}
const UserFocus = (resolve) => {
  import('../pages/user-focus/user-focus.vue').then((module) => {
    resolve(module)
  })
}
const UserNotice = (resolve) => {
  import('../pages/user-notice/user-notice.vue').then((module) => {
    resolve(module)
  })
}
const UserArticle = (resolve) => {
  import('../pages/user-article/user-article.vue').then((module) => {
    resolve(module)
  })
}
const UserArticleDetail = (resolve) => {
  import('../pages/user-article-detail/user-article-detail.vue').then((module) => {
    resolve(module)
  })
}
const UserCertification = (resolve) => {
  import('../pages/user-certification/user-certification.vue').then((module) => {
    resolve(module)
  })
}
const Contribute = (resolve) => {
  import('../pages/contribute/contribute.vue').then((module) => {
    resolve(module)
  })
}
const ContributeRevise = (resolve) => {
  import('../pages/contribute-revise/contribute-revise.vue').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('../pages/search/search.vue').then((module) => {
    resolve(module)
  })
}
const News = (resolve) => {
  import('../pages/news/news.vue').then((module) => {
    resolve(module)
  })
}
const NewsDetail = (resolve) => {
  import('../pages/news-detail/news-detail.vue').then((module) => {
    resolve(module)
  })
}
const Author = (resolve) => {
  import('../pages/author/author.vue').then((module) => {
    resolve(module)
  })
}
const Digiccy = (resolve) => {
  import('../pages/digiccy/digiccy.vue').then((module) => {
    resolve(module)
  })
}
const About = (resolve) => {
  import('../pages/site-about/site-about.vue').then((module) => {
    resolve(module)
  })
}
const SiteInstructions = (resolve) => {
  import('../pages/site-instructions/site-instructions.vue').then((module) => {
    resolve(module)
  })
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login,
      meta: {
        title: '登录 - 赛恩财经'
      }
    },
    {
      path: '/wx_login',
      component: WxLogin
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: '注册 - 赛恩财经'
      }
    },
    {
      path: '/forget',
      component: Forget,
      meta: {
        title: '找回密码 - 赛恩财经'
      }
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      meta: {
        title: '赛恩财经 - 聚合财经新媒体'
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        title: '搜索 - 赛恩财经'
      }
    },
    {
      path: '/news/0',
      redirect: '/index'
    },
    {
      path: '/news/:id',
      component: News
    },
    {
      path: '/site/:id',
      component: NewsDetail
    },
    {
      path: '/author/:id',
      component: Author
    },
    {
      path: '/digiccy',
      component: Digiccy,
      meta: {
        title: '数字货币 - 赛恩财经'
      }
    },
    {
      path: '/about',
      component: About,
      meta: {
        title: '关于我们 - 赛恩财经'
      }
    },
    {
      path: '/contact',
      component: About,
      meta: {
        title: '联系我们 - 赛恩财经'
      }
    },
    {
      path: '/notices',
      component: SiteInstructions,
      meta: {
        title: '投稿须知 - 赛恩财经'
      }
    },
    {
      path: '/copyright',
      component: SiteInstructions,
      meta: {
        title: '版权声明 - 赛恩财经'
      }
    },
    {
      path: '/agreements',
      component: SiteInstructions,
      meta: {
        title: '用户协议 - 赛恩财经'
      }
    },
    {
      path: '/user',
      redirect: '/user/center',
      component: User,
      children: [
        {
          path: '/user/center',
          component: UserCenter,
          meta: {
            title: '个人中心 - 赛恩财经'
          }
        },
        {
          path: '/user/collect',
          component: UserCollect,
          meta: {
            title: '我的收藏 - 赛恩财经'
          }
        },
        {
          path: '/user/focus',
          component: UserFocus,
          meta: {
            title: '我的关注 - 赛恩财经'
          }
        },
        {
          path: '/user/notice',
          component: UserNotice
        },
        {
          path: '/user/article',
          component: UserArticle,
          meta: {
            title: '我的文章 - 赛恩财经'
          }
        },
        {
          path: '/user/article/:id',
          component: UserArticleDetail
        },
        {
          path: '/user/certification',
          component: UserCertification,
          meta: {
            title: '实名认证 - 赛恩财经'
          }
        },
        {
          path: '/user/contribute',
          component: Contribute,
          meta: {
            title: '投稿 - 赛恩财经'
          }
        },
        {
          path: '/user/contribute/:id',
          component: ContributeRevise,
          meta: {
            title: '文章修改 - 赛恩财经'
          }
        }
      ]
    },
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
