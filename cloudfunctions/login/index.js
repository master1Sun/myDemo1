const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.status == "add") {
    return await db.collection('netData').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: wxContext.OPENID,
        startProgress: event.startProgress,
        networkContent: event.networkContent,
        networktype: event.networktype,
        networkContent_count: event.networkContent_count,
        networkList: event.networkList,
        time: event.time,
        milliseconds: event.milliseconds,
        broadband: event.kdsl,
        IP: event.IP,
        IPaddress: event.IPaddress,
        IPCode: event.IPCode,
        model: event.model,
        brand: event.brand,
        system: event.system,
        version: event.version,
        SDKVersion: event.SDKVersion,
        screenHeight: event.screenHeight,
        screenWidth: event.screenWidth,
        status: 0
      }
    })
  } else if (event.status == "get") {
    let dt = new Date().getDate() - (7 * 24 * 60 * 60 * 1000)

    return await db.collection('netData').where({
      openid: wxContext.OPENID,
      status: 0,
      milliseconds: _.gt(dt)
    }).limit(100).orderBy('milliseconds', 'desc').get()

  } else if (event.status == "update") {
    return await db.collection('netData').where({
      openid: wxContext.OPENID,
      status: 0
    }).update({
      data: {
        status: 1
      },
    })
  } else {
    return {
      event,
      wxContext
    }
  }
}