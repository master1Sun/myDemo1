const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: app.globalData.SystemInfo,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    dataList: [],
    spinning: false,
    show: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options)
  },
  getData(data) {
    var self = this
    if (self.data.dataList.length == 0) {
      self.setData({
        spinning: true
      })
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'user',
      data: {
        status: data.status,
        city: data.city,
        k: data.k,
        openid: data.openid
      },
      success: res => {
        if (res.result.data.length > 0) {
          if (data.status == "0") {
            self.setData({
              dataList: res.result.data,
              spinning: false,
              show: 0
            })
          } else {
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
              spinning: false,
              show: 1
            })
          }
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
      time: v.riqi + "  " + v.shijian,
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
  onshow2(e) {
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '../../pages/userInfo/userInfo?status=1&openid=' + openid,
    })
  },
  onback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
})