// 网络监测
const networkSpeed = require('/networkSpeed.js');
let netList = []
const app = getApp();
import * as echarts from '../../ec-canvas/echarts';
var chart;
var login = require('../../util/login.js')


function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var demoData = {
    name: 'MB/s',
    value: 0
  };
  chart.setOption(option(demoData), true);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: app.globalData.SystemInfo,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    networkSpeed: '',
    percent: 0,
    speed: 0,
    networkContent: '0KB/s',
    networkList: {
      networkContent: '网速测试会消耗一定流量'
    },
    scrollTop: 100,
    networkType1: '',
    loading: false,
    disabled: false,
    ec: {
      onInit: initChart
    },
    startProgress: '0ms',
    broadband: 0,
    copyright: new Date().getFullYear(),
    IP: '',
    IPaddress: '',
    IPCode: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.getNetworkType({
      success: function (res) {
        _this.setData({
          networkType1: res.networkType
        })
        wx.onNetworkStatusChange(function (res) {
          _this.setData({
            networkType1: res.networkType
          })
        })
        setTimeout(function () {
          var demoData = {
            name: 'MB/s',
            value: 0
          };
          chart.setOption(option(demoData), true);
        }, 1000)
      }
    })


    login.login(function (u) {
      // console.log(u.readNum)
      _this.setData({
        number: "-" + u.readNum
      })
    });
  },
  getIP() {
    var that = this;
    wx.request({
      url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (e) {
        var aaa = e.data.split(' ');
        var bbb = aaa[4].replace('"', '').replace('"', '').replace(',', '')
        var ccc = aaa[8].replace('"', '').replace('"', '').replace(',', '').replace('};', '')
        var ddd = aaa[6].replace('"', '').replace('"', '').replace(',', '').replace('};', '')
        that.setData({
          IP: bbb,
          IPaddress: ccc,
          IPCode: ddd
        })
      },
      fail: function () {
        // fail
      }
    })
  },
  startSearch() {
    netList = [];
    this.networkCallback({
      speed: 0,
      networkMillisecond: 0,
      networkContent: '0KM/s',
      networkList: [],
      startProgress: '0ms'
    })



    // 开始网络监测
    networkSpeed.startNetwork({
      self: this
    });
    // 网络监测回调
    networkSpeed.networkCallback = this.networkCallback;

    this.setData({
      loading: true,
      disabled: true
    })
  },
  endSearch() {
    // 停止网络监测
    networkSpeed.stopNetwork();
  },
  // 网络监测回调
  networkCallback: function (options) {
    var _this = this;
    if (options.networkContent_count) {
      var demoData = {
        value: options.networkContent_count,
        name: 'MB/s'
      };
      chart.setOption(option(demoData), true);
    }
    netList.push({
      networkMillisecond: options.networkMillisecond,
      networkContent: "下载带宽" + options.networkContent,
      startProgress: ">>耗时" + options.startProgress
    })

    _this.setData({
      speed: options.speed,
      networkList: netList.reverse(),
    })
    if (options.status == 1) {
      netList.push({
        speed: options.speed,
        networkMillisecond: options.networkMillisecond,
        networkContent: '结束测试',
        startProgress: ''
      })
      _this.setData({
        startProgress: options.startProgress,
        networkList: netList.reverse(),
        networkContent: options.networkContent
      })
      var kdsl = Math.round(options.networkContent_count * 8)
      if (kdsl <= 1) {
        kdsl = 1
      }
      //_this.alert(options.networktype, options.networkContent)
      _this.setData({
        broadband: kdsl,
        speed: 0,
        loading: false,
        disabled: false
      })
      var data = {
        status: "add",
        startProgress: options.startProgress,
        networkContent: options.networkContent,
        networktype: options.networktype,
        networkContent_count: options.networkContent_count,
        time: getTime(new Date()),
        milliseconds: new Date().getTime(),
        maxDownSpeen: _this.data.maxDownSpeen,
        kdsl: kdsl,
        model: _this.data.a.model,
        brand: _this.data.a.brand,
        system: _this.data.a.system,
        version: _this.data.a.version,
        SDKVersion: _this.data.a.SDKVersion,
        screenHeight: _this.data.a.screenHeight,
        screenWidth: _this.data.a.screenWidth
      }

      data.IP = _this.data.IP;
      data.IPaddress = _this.data.IPaddress
      data.IPCode = _this.data.IPCode
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'login',
        // 传递给云函数的参数
        data: data,
        success: function () {
          app.globalData.list = data;
          wx.navigateTo({
            url: '../../pages/msgInfo/msgInfo?num=1',
          })
        }
      })
    }
  },
  onUnload: function () {
    // 停止网络监测
    networkSpeed.stopNetwork();
  },
  /* 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIP();
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

  },
  onLook(e) {
    var c = e.currentTarget.dataset.c;
    wx.navigateTo({
      url: '../../pages/rop/index?c=' + c,
    })
  }
})

function getTime(time) {
  var date = new Date(time);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}



function option(demoData) {
  var option = {
    backgroundColor: '#212121',
    series: [{
      name: '测网速表',
      type: 'gauge',
      startAngle: 220,
      endAngle: -40,
      splitNumber: 5, //刻度数量
      min: 0,
      max: 50,
      radius: '100%', //图表尺寸
      axisLine: {
        show: true,
        lineStyle: {
          width: 4,
          shadowBlur: 0,
          color: [
            [0.1, 'green'],
            [0.8, 'green'],
            [1, 'red']
          ]
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#6eba44",
          width: 1
        },
        length: 10,
        splitNumber: 2
      },
      splitLine: {
        show: true,
        length: 20,
        lineStyle: {
          color: '#6eba44'
        }
      },
      axisLabel: {
        distance: 0,
        textStyle: {
          color: "#6eba44",
          fontSize: "24",
        },
        formatter: function (e) {
          return e;
        }
      },
      pointer: {
        show: true,
      },
      detail: { //指针评价
        show: true,
        offsetCenter: [0, 100],
        textStyle: {
          fontSize: 30,
          color: "#6eba44"
        },

      },
      data: [demoData]
    }]
  };
  return option;
}