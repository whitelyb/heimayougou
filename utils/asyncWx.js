// 要采用es7语法，以后再学，没有导出
export const getSetting = () => {
  return new Promise((reslove, reject) => {
    wx.getSetting({
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })  
}


export const chooseAddress = () => {
  return new Promise((reslove, reject) => {
    wx.chooseAddress({
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })  
}


export const openSetting = () => {
  return new Promise((reslove, reject) => {
    wx.openSetting({
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      },
    });
  })  
}

export const showModal = ({ content })=> {
  return new Promise((reslove, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        reslove(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const showToast = ({ title })=> {
  return new Promise((reslove, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        reslove(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const login = ()=> {
  return new Promise((reslove, reject) => {
    wx.login({
      timeout:10000,
      success: (res) => {
        reslove(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

export const requestPayment = ()=> {
  return new Promise((reslove, reject) => {
    wx.requestPayment({
      ...pay,
      success: (res) => {
        reslove(res)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}