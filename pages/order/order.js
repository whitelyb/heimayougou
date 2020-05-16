import { request } from '../../request/index.js'

Page({

  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '代发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ]
  },

  onShow(){
    // const token = wx.getStorageSync("token")
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/auth'
    //   });
    //   return
    // }   
    // 获取当前小程序的页面栈（是个数组） 长度最大是 10 页面
    let pages =  getCurrentPages();
    // 数组中 索引最大的页面就是当前页面
    let currentPages = pages[pages.length - 1]

    const { type } = currentPages.options

    // 激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type - 1)

    this.getOrders(type)
  },

  // 获取订单列表的方法
  getOrders(type){
    // const header = { Authorization: token }
    request({
      url: "/my/orders/all",
      data: { type },
      // header
    })
    .then(res => {
      console.log(res);
      
    })
  },

  handleTabsItemChange(e) {
    // 获取被点击标题的索引
    const { index } = e.detail
    this.changeTitleByIndex(index)

    // 重新发送请求
    this.getOrders(index + 1)
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false )
    this.setData({
      tabs
    })
  }
})