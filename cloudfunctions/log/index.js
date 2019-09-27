// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.getdata == true) {
    return await db.collection('log').where({
      openid: wxContext.OPENID
    }).limit(100).orderBy('date', 'desc').get()
  } else {
    const uid = wxContext.UNIONID
    if (event.text =="查看历史记录") return
    let d = {
      pageinfo: event.pageinfo,
      text: event.text,
      date: event.date,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unid: uid,
    }
    return await db.collection('log').add({
        data: d
      }).then(res => {
        return res;
      })
      .catch(console.error)
  }
}