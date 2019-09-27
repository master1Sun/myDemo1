// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.status == '0') {
    if (event.g == '0') {
      return db.collection('netData').aggregate()
        .match({
          status: 0
        })
        .group({
          _id: '$IPaddress',
          count: $.sum(1)
        })
        .end()
    } else if (event.g == '1') {
      return db.collection('netData').aggregate()
        .match({
          status: 0
        })
        .group({
          _id: '$model',
          count: $.sum(1)
        })
        .end()
    } else {
      return db.collection('netData').aggregate()
        .match({
          status: 0
        })
        .group({
          _id: '$brand',
          count: $.sum(1)
        })
        .end()
    }
  } else if (event.status == "1") {
    if (event.f == '0') {
      return db.collection('user').aggregate()
        .group({
          _id: '$IPaddress',
          count: $.sum(1)
        })
        .end()
    } else {
      return db.collection('user').aggregate()
        .group({
          _id: '$lastmodel',
          count: $.sum(1)
        })
        .end()
    }
  } else if (event.status == "2") {
    let dt = new Date().getDate() - (7 * 24 * 60 * 60 * 1000)
    let data = {
      status: 0,
      IPaddress: event.city,
      milliseconds: _.gt(dt)
    }
    if (event.count == '0') {
      data = {
        status: 0,
        IPaddress: event.city,
        milliseconds: _.gt(dt)
      }
    } else if (event.count == '1') {
      data = {
        status: 0,
        model: event.city,
        milliseconds: _.gt(dt)
      }
    } else {
      data = {
        status: 0,
        brand: event.city,
        milliseconds: _.gt(dt)
      }
    }
    const MAX_LIMIT = 100
    // 先取出集合记录总数
    const countResult = await db.collection('netData').where(data).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('netData').where(data).skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy('milliseconds', 'desc').get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  }
}