
let ajaxTimes = 0
export function request(params){
  ajaxTimes++
  // 显示加载更多
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((reslove, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        reslove(result.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--
        if(ajaxTimes === 0){
          // 关闭正在等待的图标
          wx.hideLoading()
        }
      }
        
    })
  })
}