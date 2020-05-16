// pages/goods_list/goods_list.js

import { request } from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  QueryParams: {
    query: "",
    cid: "",
    pagenum: "1",
    pagesize: "10"
  },

  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ""    
    this.QueryParams.query = options.query || ""    
    this.getGoodsList()
    
  },

  handleTabsItemChange(e) {
    // 获取被点击标题的索引
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false )
    this.setData({
      tabs
    })
  },

  getGoodsList() {
    request({
      url: '/goods/search',
      data: this.QueryParams
    })
    .then(res => {
      // 获取总条数
      const total = res.total   
      // 计算总页数
      this.totalPages = Math.ceil(total / this.QueryParams.pagesize) 
        
      this.setData({
        // 拼接数组 为了防止后面的数据覆盖前面的数组
        goodsList: [...this.data.goodsList, ...res.goods]
      })      
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      wx.showToast({
        title: '没有下一页了'
      });
        
    }else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
    
  },

  onPullDownRefresh() {

    this.setData({
      goodsList: []
    }) 
    this.QueryParams.pagenum = 1
    this.getGoodsList()   
  }

})