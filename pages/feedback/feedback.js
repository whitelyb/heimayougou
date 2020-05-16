// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 选中的图片数组
    chooseImg: [],
    textValue: ''
  },

  // 外网的图片地址 数组
  UpLoadImgs: [],

  handleTabsItemChange(e) {
    // 获取被点击标题的索引
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false )
    this.setData({
      tabs
    })
  },

  // 点击添加图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImg: [...this.data.chooseImg, ...res.tempFilePaths]
        })        
      }
    });
      
  },

  // 点击删除图片
  handleRemoveImg(e) {
    // 获取被点击图片的索引
    const { index } = e.currentTarget.dataset

    let {chooseImg } = this.data

    chooseImg.splice(index, 1)

    this.setData({
      chooseImg
    })
  },

  //文本域的输入事件 
  handleTextValue(e) {
    this.setData({
      textValue: e.detail.value
    })
  },

  // 提交按钮的点击事件
  handleFormSubmit() {
    const { textValue, chooseImg } = this.data

    if(!textValue.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });       
      return
    }
    wx.showToast({
      title: '正在上传中',
      icon: 'none',
      mask: true
    });
   
    if(chooseImg.length !== 0) {
      chooseImg.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: "file",
          formData: {},
          success: (result) => {
            let url = result.data
            this.UpLoadImgs.push(url)  
            
            // 所有的图片都上传完了再触发
            if(i === chooseImg.length - 1) {
              wx.hideLoading();
                
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              // 重置页面
              this.setData({
                chooseImg: [],
                textValue: ''
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
          
      })
    }else {
      wx.hideLoading();
      console.log("只是上传了文字");
      wx.navigateBack({
        delta: 1
      });
        
    }
   
  }
})