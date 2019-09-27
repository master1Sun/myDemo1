const app = getApp();
const log = require('../../util/log.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: app.globalData.SystemInfo,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    dataList: [],
    lengList: [],
    spinning: false
  },
  clearData() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否清除所有记录？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'login',
            // 传递给云函数的参数
            data: {
              status: 'update'
            },
            success: res => {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                dataList: []
              })
              that.getData()
              log.setCloudUSerInfo('pages/chart/chart', '删除历史记录成功')
            }, fial() {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
              log.setCloudUSerInfo('pages/chart/chart', '删除历史记录失败')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  getData() {
    var self = this
    if (self.data.dataList.length == 0) {
      self.setData({
        spinning: true
      })
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'login',
      // 传递给云函数的参数
      data: {
        status: 'get'
      },
      success: res => {
        if (res.result.data.length > 0) {
          let list = []
          let dataList = []
          let lengList = []
          res.result.data.forEach(function (v) {
            const time = v.time.split(" ")
            let rq = time[0];
            let index = self.indexof(lengList, rq)
            if (index == -1) {
              lengList.push(rq)
            }
            if (!list[rq]) {
              list[rq] = [{
                riqi: rq,
                shijian: time[1],
                model: v.model || '',
                brand: v.brand,
                system: v.system,
                version: v.version,
                SDKVersion: v.SDKVersion,
                screenHeight: v.screenHeight,
                screenWidth: v.screenWidth,
                networktype: v.networktype,
                networkContent: v.networkContent,
                startProgress: v.startProgress,
                broadband: v.broadband,
                IP: v.IP,
                IPaddress: v.IPaddress,
                IPCode: v.IPCode
              }]
            } else {
              list[rq].push({
                riqi: rq,
                shijian: time[1],
                model: v.model || '',
                brand: v.brand,
                system: v.system,
                version: v.version,
                SDKVersion: v.SDKVersion,
                screenHeight: v.screenHeight,
                screenWidth: v.screenWidth,
                networktype: v.networktype,
                networkContent: v.networkContent,
                startProgress: v.startProgress,
                broadband: v.broadband,
                IP: v.IP,
                IPaddress: v.IPaddress,
                IPCode: v.IPCode
              })
            }
          })

          lengList.forEach(function (v) {
            dataList.push({
              t: v,
              p: list[v]
            })
          })
          self.setData({
            dataList: dataList,
            spinning: false
          })
        }
      },
      fail: err => {
        // handle error
        console.log(err)
      },
      complete: () => {
        // ...
        self.setData({
          spinning: false
        })
      }
    })
  },
  indexof: function (d, a) {
    for (let i = 0; i < d.length; i++) {
      if (d[i] == a) {
        return i;
      }
    }
    return -1;
  },
  onshow(e) {
    var v = e.currentTarget.dataset.list;
    var data = {
      networkContent: v.networkContent,
      time: v.riqi +"  "+ v.shijian,
      IP: v.IP,
      IPaddress: v.IPaddress,
      IPCode: v.IPCode,
      model: v.model || '',
      brand: v.brand,
      system: v.system,
      version: v.version,
      SDKVersion: v.SDKVersion,
      screenHeight: v.screenHeight,
      screenWidth: v.screenWidth,
      networktype: v.networktype,
      kdsl: v.broadband,
      startProgress: v.startProgress
    }
    app.globalData.list = data;
    wx.navigateTo({
      url: '../../pages/msgInfo/msgInfo?num=0',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})