// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.status == "0") {
    let data = {
      IPaddress: event.city
    }
    if (event.k == "0") {
      data = {
        IPaddress: event.city
      }
    } else {
      data = {
        lastmodel: event.city
      }
    }
    const MAX_LIMIT = 100
    // 先取出集合记录总数
    const countResult = await db.collection('user').where(data).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('user').where(data).skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy('lastTime', 'desc').get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  } else {
    let dt = new Date().getDate() - (7 * 24 * 60 * 60 * 1000)

    return await db.collection('netData').where({
      openid: event.openid,
      status: 0,
      milliseconds: _.gt(dt)
    }).limit(100).orderBy('milliseconds', 'desc').get()

  }
}