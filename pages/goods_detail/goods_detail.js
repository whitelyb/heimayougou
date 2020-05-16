// pages/goods_detail/goods_detail.js
import { request } from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: [],
    isCollect: false
  },

  GoodsInfo: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();

    const currentPages = pages[pages.length - 1]

    const options = currentPages.options

    const { goods_id } = options
    this.getGoogsDetail(goods_id)



  },

  getGoogsDetail(goods_id) {
    request({
      url: '/goods/detail',
      data: { goods_id }
    })
      .then(res => {
        this.GoodsInfo = res

        // 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || []

        // 判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)

        this.setData({
          goodsObj: {
            goods_name: res.goods_name,
            goods_price: res.goods_price,
            // iPhone手机不识别 webp 图片格式
            goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
            pics: res.pics
          },
          isCollect
        })

      })
  },

  // 点击轮播图， 放大预览
  handlePreviewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  // 点击加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || []

    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 3.不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 4.已经存在购物车数据 执行 num++
      cart[index].num++
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart)

    // 6.弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: "success",
      mask: true
    });

  },

  // 点击收藏功能
  handleCollect() {
    let isCollect = false
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || []

    // 怕毛短该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)

    // 当 index !== -1 就是能找到
    if(index !== -1) {
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: "取消成功",
        icon: "success",
        mask: true
      })
    }else {
      // 不能找到 没有收藏过 
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true
      })
    }
    wx.setStorageSync("collect", collect)

    this.setData({
      isCollect
    })
  }
})