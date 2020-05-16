
import { showModal,showToast } from "../../utils/asyncWx"

Page({
  data: {
    address: {},
    cart: [],
    allChecked: true,
    totalPrice: 0,
    totalNum: 0  
  },

  onShow(){
    // 获取缓存中的地址
    const address = wx.getStorageSync("address")

    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || []

    this.setData({
      address
    })

    this.setCart(cart)

    // 计算全选
    // every 数组方法会遍历 如果里面的的每一个值都为 true 那么every 方法就会返回true
    // 只要有一个值为 false 就会返回 false 
    // 空数组调用 every，返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false

  },
  // 获取用户地址
  handleChooseAddress() {
    // 1.获取权限状态
    wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting["scope.address"]
        if(scopeAddress === true || scopeAddress === undefined){
          wx.chooseAddress({
            success: (result1) => {
              // 存入到缓存中
              wx.setStorageSync("address", result1);
            }
          }); 
        }else {
          // 用户以前拒绝过授予权限 先诱导用户打开授权界面
          wx.openSetting({
            success: (result2) => {
              wx.chooseAddress({
                success: (result2) => {
                   // 存入到缓存中
                  wx.setStorageSync("address", result2);
                }
              }); 
            }
          });
            
        }
      }
    });
      
   
      
  },

  handleItemChange(e) {
    // 获取被修改的商品 id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品
    let index = cart.findIndex(v => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
  },

  // 设置购物车状态，同时重新计算底部工具栏的数据 全选 总价格 总数量
  setCart(cart) {
    let totalPrice = 0
    let totalNum = 0
    let allChecked = true
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      }else {
        allChecked = false
      }
    })
    allChecked = cart.length != 0 ? allChecked : false 

    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })

    wx.setStorageSync("cart", cart)
  },

  // 商品全选功能
  handleItemAllChecked() {
    // 1.获取 data 中的数据
    let { cart, allChecked } = this.data
    
    // 2.修改值
    allChecked = !allChecked

    // 3.循环修改 cart 中 allChecked 的值
    cart.forEach(v => v.checked = allChecked)

    // 4.将修改后的数据填充回 data 或者缓存中
    this.setCart(cart)
  },

  // 商品数量的编辑功能
  handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset

    const {cart} = this.data

    const index = cart.findIndex(v => v.goods_id === id)

    if(cart[index].num === 1 && operation === -1) {
          // 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index, 1)
      //       this.setCart(cart)
      //     } 
      //   }
      // })

      showModal({content: "您是否要删除"})
      .then(res => {
        if (res.confirm) {
          cart.splice(index, 1)
          this.setCart(cart)
        } 
      })
    }else {
  
      cart[index].num += operation

      this.setCart(cart)
    }
      
  },

  // 商品结算
  handlePay() {
    // 1.判断有没有收货地址
    const { address, totalNum } = this.data
     
    if(!address.userName) {
      showToast({title: "您还没有添加收货地址"})
      return
    }
    // 2.判断有没有选购商品

    if(totalNum === 0) {
      showToast({title: "您还没有选购商品"})
      return
    }
    // 3.经过以上认证 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
      
  } 
})