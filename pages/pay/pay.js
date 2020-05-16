import { request } from "../../request/index.js"
import { requestPayment } from "../../utils/asyncWx.js"

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的地址
    const address = wx.getStorageSync("address")

    // 获取缓存中购物车的数据
    let cart = wx.getStorageSync("cart") || []

    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)

    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })

  },

  // 点击 支付
  handleOrderPay() {
    try {
      // 1.判断缓存中有没有 token
      const token = wx.getStorageSync("token")
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return
      }
      // 2.创建订单
      // 2.1 准备请求头参数
      const header = { Authorization: token }
      // 2.2 准备请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const { cart } = this.data
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))

      const orderParams = { order_price, consignee_addr, goods }
      // 3.准备发送请求 创建订单 获取订单编号
      request({
        url: "/my/orders/create",
        method: "post",
        data: orderParams,
        header
      })
        .then(res => {
          const { order_number } = res
          // 4.发起预支付接口
          request({
            url: "/my/orders/req_unifiedorder",
            method: "post",
            data: order_number,
            header
          })
            .then(res => {
              const { pay } = res
              // 5.发起微信支付
              requestPayment({
                pay
              })
              // 6.查询后台订单状态
              request({
                url: "/my/orders/chkOrder",
                method: "post",
                data: order_number,
                header
              })
              
                .then(res => {
                  wx.showToast({
                    title: '支付成功'
                  })
                  // 7.手动删除缓存中已经支付了商品
                  let newCart = wx.getStorageSync("cart")
                  newCart = newCart.filter(v => !v.checked)
                  wx.setStorageSync("cart", newCart);
                    
                  // 8.支付成功了 跳转到订单页面
                  wx.navigateTo({
                    url: '/pages/order/order'
                  });
                    
                    
                })
            })
        })
    } catch (error) {
      wx.showToast({
        title: '支付失败'
      })
      console.log(error);

    }

  }
})