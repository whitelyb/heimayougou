import { login } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"

Page({
  data: {
    code: 0
  },

  // 获取用户信息
  handleGetUserInfo(e) {
    // 1.获取用户信息
    const { encryptedData, iv, rawData, signature } = e.detail

    // 2.获取小程序登陆成功的 code
    login()
      .then(res => {

        const { code } = res

        const loginParams = { encryptedData, iv, rawData, signature, code }
        // 3.发送请求 获取用户的 token
        request({
          url: "/users/wxlogin",
          data: loginParams,
          method: "post"
        })
          .then(res => {
            const { token } = res
            // 4.把token 存入到缓存中，同时跳转回上一个页面
            wx.setStorageSync("token", token)

            wx.navigateBack({
              delta: 1
            });
          })


      })



  }
})