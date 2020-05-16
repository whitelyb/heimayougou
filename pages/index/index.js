//index.js
//获取应用实例
//Page Object

import { request } from '../../request/index.js'

Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // wx.request({
    //   url: '/home/swiperdata',
    //   success: (result) => {
    //    this.setData({
    //     swiperList: result
    //    })

    //   }
    // });
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    })
      .then((result) => {
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    })
      .then((result) => {
        this.setData({
          catesList: result
        })
      })
  },
   // 获取楼层数据
   getFloorList() {
    request({
      url: '/home/floordata'
    })
      .then((result) => {
        this.setData({
          floorList: result
        })
      })
  },

});

