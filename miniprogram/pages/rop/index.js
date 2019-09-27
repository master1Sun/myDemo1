const app = getApp();
var count = 0;
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
    show: true,
    cba: false,
    tabs: ["城市排行", "设备排行"],
    activeIndex: 0,
    tabsTwo: ["城市排行", "设备排行", "品牌排行"],
    activeTwoIndex: 0,
    titleShow: false
  },
  tabClick: function (e) {
    if (e.currentTarget.id == 0) {
      this.getData({
        status: 1,
        city: '',
        f: 0
      })
      this.setData({
        show: true,
        cba: true
      })
    } else {
      this.getData({
        status: 1,
        city: '',
        f: 1
      })
      this.setData({
        show: true,
        cba: true
      })
    }
    var _this = this;
    setTimeout(function () {
      _this.setData({
        activeIndex: e.currentTarget.id
      });
    }, 80)
  },
  tabClickTwo: function (e) {
    count = e.currentTarget.id
    if (e.currentTarget.id == 0) {
      this.getData({
        status: 0,
        city: '',
        g: 0
      })
      this.setData({
        show: true,
        cba: false
      })
    } else if (e.currentTarget.id == 1) {
      this.getData({
        status: 0,
        city: '',
        g: 1
      })
      this.setData({
        show: true,
        cba: false
      })
    } else {
      this.getData({
        status: 0,
        city: '',
        g: 2
      })
      this.setData({
        show: true,
        cba: false
      })
    }

    var _this = this;
    setTimeout(function () {
      _this.setData({
        activeTwoIndex: e.currentTarget.id
      });
    }, 80)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof options.city == "undefined") {
      if (options.c == '0') {
        this.getData({
          status: 1,
          city: '',
          f: 0
        })
        this.setData({
          show: true,
          cba: true
        })
      } else {
        this.getData({
          status: 0,
          city: '',
          g: 0
        })
        this.setData({
          show: true,
          cba: false
        })
      }
    } else {
      this.getDatainfo({
        status: 2,
        city: options.city,
        h: options.h
      })
      this.setData({
        show: false
      })
    }
  },
  onshow2(e) {
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
      name: 'rop',
      data: {
        status: data.status,
        city: data.city,
        f: data.f,
        g: data.g
      },
      success: res => {
        console.log(res.result.list)
        if (res.result.list.length > 0) {
          self.setData({
            dataList: res.result.list.sort(function (a, b) {
              return b.count - a.count;
            }),
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
  getDatainfo(data) {
    var self = this
    if (self.data.dataList.length == 0) {
      self.setData({
        spinning: true
      })
    }

    if (data.h == '0') {
      self.setData({
        titleShow: true
      })
    } else if (data.h == '1') {
      self.setData({
        titleShow: false
      })
    } else {
      self.setData({
        titleShow: false
      })
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'rop',
      data: {
        status: data.status,
        city: data.city,
        count: count
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
              lengList.push({ rq: rq, city: v.IPaddress, brand: v.brand })
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
              t: v.rq,
              city: v.city,
              brand: v.brand,
              p: list[v.rq]
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
  onshow(e) {
    var v = e.currentTarget.dataset.list;
    wx.navigateTo({
      url: '../../pages/rop/index?city=' + v._id + '&h=' + count,
    })
  },
  indexof: function (d, a) {
    for (let i = 0; i < d.length; i++) {
      if (d[i].rq == a) {
        return i;
      }
    }
    return -1;
  },
  onback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onshow3(e) {
    var id = e.currentTarget.dataset.id;
    var city = e.currentTarget.dataset.city;
    wx.navigateTo({
      url: '../../pages/userInfo/userInfo?status=0&city=' + city + '&k=' + id,
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