// 引入SDK核心类
var db = wx.cloud.database();

var uData = {
  openid: '',
  time: '',
  status: false,
  readNum: 1,
  publish: false,
  screenHeightAndWidth: '',
  system: '',
  model: '',
  networkType: ''
}

module.exports = {
  login: login
}

function login(suc) {
  uData.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
  getinfoData_no(suc);
}

function getinfoData_no(suc) {
  wx.getSystemInfo({
    success: function (res) {
      uData.model = res.model;
      uData.screenHeightAndWidth = res.screenHeight + "*" + res.screenWidth;
      uData.system = res.system;
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          uData.networkType = res.networkType;
          wirteData(suc);
        }
      })
    }
  })
}




function wirteData(suc) {
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
      uData.IP = bbb;
      uData.IPaddress = ccc
      uData.IPCode = ddd
      loadData(suc);
    },
    fail: function () {
      // fail
      loadData(suc);
    }
  })

}


function loadData(suc) {
  getCloudUSerInfo(function (res) {
    uData.openid = res.result.wxContext.OPENID;
    uData.appid = res.result.wxContext.APPID;
    const adata = {
      openid: uData.openid,
      createTime: uData.time,
      lastTime: uData.time,
      status: false,
      readNum: 1,
      toDay: 1,
      toWeek: 1,
      publish: uData.publish,
      screenHeightAndWidth: uData.screenHeightAndWidth,
      system: uData.system,
      model: uData.model,
      lastmodel: uData.model,
      networkType: uData.networkType,
      lastnetworkType: uData.networkType,
      lastsystem: uData.system,
      IP: uData.IP,
      IPaddress: uData.IPaddress,
      IPCode: uData.IPCode
    }
    getData({
      openid: uData.openid
    }, function (res) {
      if (res.data && res.data.length <= 0) {
        addData(adata, function (res) {
          uData.readNum = 1;
          uData.toDay = 1;
          uData.toWeek = 1;
          uData.status = false;
          if (suc) {
            suc(uData);
          }
        }, function (e) {
          uData.readNum = 1;
          uData.toDay = 1;
          uData.toWeek = 1;
          uData.status = false;
          if (suc) {
            suc(uData);
          }
        })
      } else {
        var _id = res.data[0]._id;
        var _readNum = res.data[0].readNum;
        var _toDay = res.data[0].toDay;
        var _toWeek = res.data[0].toWeek;
        _readNum = _readNum + 1;
        _toDay = _toDay + 1;
        _toWeek = _toWeek + 1;
        let update = [];
        update = {
          readNum: _readNum,
          toDay: _toDay,
          toWeek: _toWeek,
          lastTime: uData.time,
          lastAddress: uData.address,
          lastnetworkType: uData.networkType,
          lastsystem: uData.system,
          lastmodel: uData.model,
          city: uData.city,
          IP: uData.IP,
          IPaddress: uData.IPaddress,
          IPCode: uData.IPCode
        }
        updateData(_id, update, function () {
          uData.readNum = _readNum || 1;
          uData.toDay = _toDay || 1;
          uData.toWeek = _toWeek || 1;
          uData.status = res.data[0].status || uData.status;
          uData.publish = res.data[0].publish || uData.publish;
          if (suc) {
            suc(uData);
          }
        }, function (e) {
          uData.readNum = 1;
          uData.status = false;
          if (suc) {
            suc(uData);
          }
          console.error(e)
        })
      }
    })
  })
}


function getData(data, success, error) {
  db.collection('user').where(data).get().then(res => {
    if (success) {
      success(res);
    }
  })
    .catch(err => {
      if (error) {
        error(err);
      }
    })
}

function addData(data, success, error) {
  db.collection('user').add({
    data: data
  }).then(res => {
    if (success) {
      success(res);
    }
  })
    .catch(err => {
      if (error) {
        error(err);
      }
    })
}

function updateData(_id, data, success, error) {
  db.collection('user').doc(_id).update({
    data: data
  }).then(res => {
    if (success) {
      success(res);
    }
  }).catch(err => {
    if (error) {
      error(err);
    }
  })
}

function getCloudUSerInfo(success, error) {
  wx.cloud.callFunction({
    name: 'login',
    success: res => {
      if (success) {
        success(res);
      }
    },
    fail: err => {
      if (error) {
        error(err);
      }
    }
  })
}


// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}