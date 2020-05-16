import { request } from '../../request/index.js'
Page({

  data: {
    // 左侧的菜单数据
    leftMenuList: [],

    // 右侧的商品数据
    rightContnet: [],

    // 被点击的左侧菜单
    currentIndex: 0,

    // 右侧内容距离顶部的距离
    scrollTop: 0

  },
  Cates: [],

  onLoad: function (options) {
    // 先判断本地有没有旧的数据
    // {time: Data.now(), data: [...]}
    // 没有旧的数据直接发送请求
    // 有旧的数据 且旧的数据没有过期  就使用本地存储的旧数据

    // 1.获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");

    // 2.判断
    if (!Cates) {
      // 不存在，发送请求 获取数据
      this.getCates()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        this.Cates = Cates.data
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name)

        // 构造右侧的商品数据
        let rightContnet = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContnet
        })

      }
    }

  },
  // 获取分类数据
  getCates() {
    request({
      url: '/categories'
    })
      .then((res) => {
        this.Cates = res
        // 将获取到的数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })

        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name)

        // 构造右侧的商品数据
        let rightContnet = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContnet
        })

      })
  },

  handleItemTap(e) {
    // 1.获取被点击的标题身上的索引
    const { index } = e.currentTarget.dataset

    // 2.给data 中的 currentIndex 赋值就可以了 

    // 3.根据不同的索引来渲染右侧的商品内容

    let rightContnet = this.Cates[index].children

    this.setData({
      currentIndex: index,
      rightContnet,
      scrollTop: 0
    })

  }

})