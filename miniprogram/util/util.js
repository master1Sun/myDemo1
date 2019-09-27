const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimejian = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() - 30
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const getTomon = () => {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 6) {
    return "凌晨好！"
  } else if (hour < 9) {
    return "早上好！"
  } else if (hour < 12) {
    return "上午好！"
  } else if (hour < 14) {
    return "中午好！"
  } else if (hour < 17) {
    return "下午好！"
  } else if (hour < 19) {
    return "傍晚好！"
  } else if (hour < 22) {
    return "晚上好！"
  } else {
    return "夜里好！"
  }
}


module.exports = {
  formatTime: formatTime,
  formatTimeDay: formatTimeDay,
  getTomon: getTomon,
  formatTimeTwo: formatTimeTwo,
  formatTimejian: formatTimejian
}