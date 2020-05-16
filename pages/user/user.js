// pages/user/user.js
Page({

  data: {
    userInfo: {},
    collectNum: 0
  },

  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");

    const collect = wx.getStorageSync("collect")

    this.setData({
      userInfo,
      collectNum: collect.length
    })
      
  }

 
})