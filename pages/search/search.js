import { request } from '../../request/index.js'

Page({

 
  data: {
    goods: [],
    isFocus: false,
    inputValue: ''
  },

  timeId: -1,

  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    
    const { value } = e.detail
    
    if(!value.trim()){
      this.setData({
        isFocus: false,
        goods: []
      })
      return
    }
    this.setData({
      isFocus: true
    })
    // 防抖 一般 在输入框中 防止重复输入 重复发送请求
    // 节流 一般是用在页面下拉和上拉
    clearTimeout(this.timeId)
    this.timeId = setTimeout(() => {
      this.qSearch(value)
    }, 1000)
  },

  qSearch(query) {
    request({
      url: "/goods/qsearch",
      data: { query }
    })
    .then(res => {
      this.setData({
        goods: res
      })
    })
  },

  handleCancel() {
    this.setData({
      goods: [],
      isFocus: false,
      inputValue: ''
    })
  }
})