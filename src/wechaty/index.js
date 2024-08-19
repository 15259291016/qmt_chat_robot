import { WechatyBuilder, ScanStatus, log } from 'wechaty'
import inquirer from 'inquirer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import qrTerminal from 'qrcode-terminal'
import { defaultMessage, shardingMessage } from './sendMessage.js'
import { MessageSender } from './messageHandler.js'
import dotenv from 'dotenv'
const env = dotenv.config().parsed
const botName = env.BOT_NAME
// 扫码
function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 在控制台显示二维码
    qrTerminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log('Scan:', qrcodeImageUrl, ScanStatus[status], status)
  } else {
    log.info('Scan: %s(%s)', ScanStatus[status], status)
  }
}

// 登录
function onLogin(user) {
  console.log(`用户 ${user} 登录`)
  const date = new Date()
  console.log(`当前时间: ${date}`)
  console.log(`Auto chatbot mode activated`)

  // 加载任务
  const currentFilePath = fileURLToPath(import.meta.url)
  const currentDirPath = dirname(currentFilePath)
  const messageSender = new MessageSender(bot)
  messageSender.loadTasksFromJSON(join(currentDirPath, '..', 'tasks', 'tasks.json'))
}

// 登出
function onLogout(user) {
  console.log(`${user} 下线`)
}

// 收到好友请求
async function onFriendShip(friendship) {
  const frienddShipRe = new RegExp(`我也想养生|${botName}`)
  if (friendship.type() === 2) {
    if (frienddShipRe.test(friendship.hello())) {
      await friendship.accept()
    }
  }
}

// 收到有人加群请求
async function onRoomJoin(room, inviteeList, inviter) {  
  const nameList = inviteeList.map(c => c.name()).join(',')  
  console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
}

// 收到有人退群请求
async function onRoomLeave(room, leaverList) {  
  const nameList = leaverList.map(c => c.name()).join(',')  
  console.log(`Room ${room.topic()} lost member ${nameList}`)
}

/**
 * 消息发送
 * @param msg
 * @param isSharding
 * @returns {Promise<void>}
 */
async function onMessage(msg) {
  // 默认消息回复
  await defaultMessage(msg, bot, serviceType)
  // 消息分片
  // await shardingMessage(msg,bot)
}

// 初始化机器人
const CHROME_BIN = process.env.CHROME_BIN ? { endpoint: process.env.CHROME_BIN } : {}
let serviceType = ''
export const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
  // puppet: 'wechaty-puppet-wechat', // 如果 wechaty-puppet-wechat 存在问题，也可以尝试使用上面的 wechaty-puppet-wechat4u ，记得安装 wechaty-puppet-wechat4u
  puppetOptions: {
    uos: true,
    ...CHROME_BIN
  },
})
// export const bot = WechatyBuilder.build({
//   name: 'WechatEveryDay',
//   // puppet: "wechaty-puppet-wechat",
//   // puppetOptions: {
//   //   uos: true
//   // }
// })

// 扫码
bot.on('scan', onScan)
// 登录
bot.on('login', onLogin)
// 登出
bot.on('logout', onLogout)
// 收到消息
bot.on('message', onMessage)
// 添加好友     好友管理
bot.on('friendship', onFriendShip)
// 收到入群邀请
bot.on('room-invite', invitation => console.log('收到入群邀请：' + invitation))      
// 有人加群
bot.on('room-join', onRoomJoin)      
// 有人退群
bot.on('room-topic', onRoomLeave)
// 错误
bot.on('error', (e) => console.error('bot error❌: ', e))
// 启动微信机器人
function botStart() {
  bot
  .start()
  .then(() => console.log('开始登录微信...'))
  .catch((e) => console.error(e))
}

// 控制启动
function handleStart(type) {
  serviceType = type
  console.log('🌸🌸🌸 / type: ', type)
  switch (type) {
    case 'ChatGPT':
      if (env.OPENAI_API_KEY) return botStart()
      console.log('❌ 请先配置.env文件中的 OPENAI_API_KEY')
      break
    case 'Kimi':
      if (env.KIMI_API_KEY) return botStart()
      console.log('❌ 请先配置.env文件中的 KIMI_API_KEY')
      break
    default:
      console.log('🚀服务类型错误')
  }
}

const serveList = [
  { name: 'ChatGPT', value: 'ChatGPT' },
  { name: 'Kimi', value: 'Kimi' },
  // ... 欢迎大家接入更多的服务
]
const questions = [
  {
    type: 'list',
    name: 'serviceType', //存储当前问题回答的变量key，
    message: '请先选择服务类型',
    choices: serveList,
  },
]
function init() {
  inquirer
    .prompt(questions)
    .then((res) => {
      // handleStart(res.serviceType)
      handleStart('Kimi')
    })
    .catch((error) => {
      console.log('🚀error:', error)
    })
}
// init()
handleStart('Kimi')
