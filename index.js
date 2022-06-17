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
const cookieInfo = `_ga=GA1.2.1189009023.1653035613; MONITOR_WEB_ID=2c54a6e2-a41f-4153-9d0f-4639cdbaef62; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227099733837151847951%2522%252C%2522user_unique_id%2522%253A%25227099733837151847951%2522%252C%2522timestamp%2522%253A1653035613895%257D; passport_csrf_token=4edcd3ecd940ca05a42707dad8956184; passport_csrf_token_default=4edcd3ecd940ca05a42707dad8956184; n_mh=bDIUel3cuUf5xoQ71uf8vel7kGXNMv_yZZSbroVC-Bk; passport_auth_status=623065f9ab360980253095f0c33bc279%2C; passport_auth_status_ss=623065f9ab360980253095f0c33bc279%2C; sid_guard=8783de2e5fee41070502a3a913a6d12c%7C1653268643%7C31536000%7CTue%2C+23-May-2023+01%3A17%3A23+GMT; uid_tt=8b3165b3514d65145601b2f33f091317; uid_tt_ss=8b3165b3514d65145601b2f33f091317; sid_tt=8783de2e5fee41070502a3a913a6d12c; sessionid=8783de2e5fee41070502a3a913a6d12c; sessionid_ss=8783de2e5fee41070502a3a913a6d12c; sid_ucp_v1=1.0.0-KGEzOGE1YjdhMTljNTNlNDE4ZDg2YzgxMTNjNzlkZGU2ZDk5MDNmZmMKFwj3sMCO9fXDBhCjwauUBhiwFDgCQPEHGgJsZiIgODc4M2RlMmU1ZmVlNDEwNzA1MDJhM2E5MTNhNmQxMmM; ssid_ucp_v1=1.0.0-KGEzOGE1YjdhMTljNTNlNDE4ZDg2YzgxMTNjNzlkZGU2ZDk5MDNmZmMKFwj3sMCO9fXDBhCjwauUBhiwFDgCQPEHGgJsZiIgODc4M2RlMmU1ZmVlNDEwNzA1MDJhM2E5MTNhNmQxMmM; _tea_utm_cache_2608={%22utm_source%22:%22slide%22%2C%22utm_medium%22:%22OM%22%2C%22utm_campaign%22:%22vip_presale_2022%22}`
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
