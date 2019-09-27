
//获取数据
function getCloudUSerInfo(success, error) {
  wx.cloud.callFunction({
    name: 'log',
    data:{
      getdata:true
    },
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

//写入数据
function setCloudUSerInfo(pageinfo, text, success) {
  let date = formatTime(new Date());
  let d = {
    pageinfo,
    text,
    date,
    getdata: false
  }
  wx.cloud.callFunction({
    name: 'log',
    data: d,
    success: res => {
      if (success) {
        success(res);
      }
    },
    fail: err => {
      if (success) {
        success(err);
      }
    }
  })
}


module.exports = {
  setCloudUSerInfo,
  getCloudUSerInfo
}



const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}