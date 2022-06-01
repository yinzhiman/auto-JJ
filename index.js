// index.js

"use strict"

// Nodemailer是一个简单易用的Node.js邮件发送组件
const nodeMailer = require('nodemailer');
// 易用、简洁且高效的http库
const axios = require('axios');
// 请求签到、抽奖的接口
const checkInApi = "https://api.juejin.cn/growth_api/v1/check_in"
const drawApi = "https://api.juejin.cn/growth_api/v1/lottery/draw"
// 请求接口的cookie配置 cookie的获取见下面的图片说明
const cookieInfo = `_ga=GA1.2.44236337.1649812250; MONITOR_WEB_ID=5e20c92e-b882-4a68-89f2-0592f0c43360; passport_csrf_token=3e4c367eca2112f1192386690687c8f8; passport_csrf_token_default=3e4c367eca2112f1192386690687c8f8; n_mh=bDIUel3cuUf5xoQ71uf8vel7kGXNMv_yZZSbroVC-Bk; sid_guard=3844a59b8d71ba6fc7fe4e0e04e68718|1649812329|5184000|Sun,+12-Jun-2022+01:12:09+GMT; uid_tt=bb00e1a8507cc9edcb17e76bd7003ae2; uid_tt_ss=bb00e1a8507cc9edcb17e76bd7003ae2; sid_tt=3844a59b8d71ba6fc7fe4e0e04e68718; sessionid=3844a59b8d71ba6fc7fe4e0e04e68718; sessionid_ss=3844a59b8d71ba6fc7fe4e0e04e68718; sid_ucp_v1=1.0.0-KGFmMjgwMTc4MTBhZWY4NmNmYTBlOTFhNDlkZmExYmI4NDA0ZTgwNzUKFwj3sMCO9fXDBhDpxtiSBhiwFDgCQPEHGgJsZiIgMzg0NGE1OWI4ZDcxYmE2ZmM3ZmU0ZTBlMDRlNjg3MTg; ssid_ucp_v1=1.0.0-KGFmMjgwMTc4MTBhZWY4NmNmYTBlOTFhNDlkZmExYmI4NDA0ZTgwNzUKFwj3sMCO9fXDBhDpxtiSBhiwFDgCQPEHGgJsZiIgMzg0NGE1OWI4ZDcxYmE2ZmM3ZmU0ZTBlMDRlNjg3MTg; __tea_cookie_tokens_2608=%7B%22web_id%22%3A%227085889942656910848%22%2C%22user_unique_id%22%3A%227085889942656910848%22%2C%22timestamp%22%3A1649812330369%7D; _tea_utm_cache_2608={"utm_source":"bdpcjjqd02371","utm_medium":"sem_baidu_jj_pc_dc01","utm_campaign":"sembaidu"}; _gid=GA1.2.1387314810.1653015214`
// 发送邮件的配置
// user、from、to都填写自己的qq邮箱, pass的获取见下面的图片说明
const emailInfo =  {
  "user": "1174043641@qq.com",
  "from": "1174043641@qq.com",
  "to": "1174043641@qq.com",
  "pass": "dpcittntgseliibj"
}
// 请求签到接口
const checkIn = async () => {
  let {data} = await axios({url: checkInApi, method: 'post', headers: {Cookie: cookieInfo}});
  return data
}
// 请求抽奖接口
const draw = async () => {
  let {data} = await axios({ url: drawApi, method: 'post', headers: { Cookie: cookieInfo } });
  return data
}
// 签到完成 发送邮件
const sendQQEmail = async (subject, html) => {
  let {user, from, to, pass } = emailInfo;
  const transporter = nodeMailer.createTransport({ service: 'qq', auth: { user, pass } });
  transporter.sendMail({ from, to, subject, html },  (err) => {
    if (err) return console.log(`发送邮件失败：${err}`);
    console.log('发送邮件成功')
  })
}
// 触发签到和抽奖的方法
const signIn = async () => {
  const checkInData = await checkIn();
  const drawData = await draw();
  console.log('🔥', checkInData, drawData)
  if(checkInData.data && drawData.data) {
    sendQQEmail('掘金签到和抽奖成功', `掘金签到成功！今日获得${checkInData.data.incr_point}积分，当前总积分：${checkInData.data.sum_point}。 掘金免费抽奖成功, 获得：${drawData.data.lottery_name}`);
  } else if(checkInData.data && !drawData.data) {
    sendQQEmail('掘金签到成功, 抽奖失败', `掘金签到成功！今日获得${checkInData.data.incr_point}积分，当前总积分：${checkInData.data.sum_point}。 掘金免费抽奖失败, ${JSON.stringify(drawData)}`);
  }  else if(!checkInData.data && drawData.data) {
    sendQQEmail('掘金签到失败, 抽奖成功', `掘金签到失败！${JSON.stringify(checkInData)}。 掘金免费抽奖成功, 获得：${drawData.data.lottery_name}`);
  } else if(!checkInData.data && !drawData.data) {
    sendQQEmail('掘金签到和抽奖失败', `掘金签到失败！${JSON.stringify(checkInData)}。 掘金免费抽奖失败, ${JSON.stringify(drawData)}`);
  } 
};
signIn()