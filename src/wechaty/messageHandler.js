import { FileBox } from 'file-box'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import path from 'path'
import { encrypt } from '../utils/index.js'
import {
  fetchMoyuData,
  fetchSixsData,
  fetchTianGouData,
  fetchOneDayEnglishData,
  fetchConstellationsData,
  fetchBoyImage,
  fetchGirlImage,
  fetchGirlVideo,
  fetchRandomBeautyGirlVideo,
  fetchFabingData,
  fetchTJ,
  fetchCK,
  fetchSC,
  fetchTSGP,
  fetchTHS,
  fetchFkxqsData,
  fetchGenerationsData,
  endpointsMap,
  fetchJKData,
  fetchYiYanData,
} from '../services/index.js'
import { containsHtmlTags, getRedirectUrl, parseCommand } from '../utils/index.js'
import { createSpackPicture, parseMessage } from '../spark/picture.js'
import axios from 'axios'
import dotenv from 'dotenv'
const env = dotenv.config().parsed
const botName = env.BOT_NAME
export class MessageHandler {
  constructor(bot) {
    this.bot = bot
  }

  async handlePing(msg) {
    try {
      await msg.say('pong')
      console.log('Pong message sent successfully')
    } catch (error) {
      console.error('Error sending pong message:', error)
    }
  }

  async handleMoYu(msg) {
    try {
      const { data } = await fetchMoyuData()
      if (data.success) {
        await msg.say(FileBox.fromUrl(data.url))
        console.log('MoYu data message sent successfully')
      } else {
        await msg.say('获取摸鱼数据失败')
        console.error('Error: 摸鱼数据请求失败，状态码:', data)
      }
    } catch (error) {
      console.error('Error sending MoYu data message:', error)
      await msg.say('获取摸鱼数据失败')
    }
  }

  async handleSixs(msg) {
    try {
      const { data } = await fetchSixsData()
      if (data.code === '200') {
        await msg.say(FileBox.fromUrl(data.image))
        console.log('Sixs data message sent successfully')
      } else {
        await msg.say('获取新闻60s数据失败')
        console.error('Error: 新闻60s数据请求失败，状态码:', data.code)
      }
    } catch (error) {
      console.error('Error sending Sixs data message:', error)
    }
  }

  async handleDog(msg) {
    try {
      const { data = '' } = await fetchTianGouData()
      if (containsHtmlTags(data)) {
        const result = data.replace(/<[^>]*>/g, '')
        await msg.say(result.trim())
        console.log('Dog data message sent successfully')
      } else {
        // 如果数据不包含 HTML 标签，发送一条提示消息
        await msg.say('舔狗日记数据为空或无效')
        console.log('Dog data is empty or invalid')
      }
    } catch (error) {
      console.error('Error sending Dog data message:', error)
    }
  }

  async handleDailyEnglish(msg) {
    try {
      const { data } = await fetchOneDayEnglishData()
      if (data.code === 200) {
        await msg.say(FileBox.fromUrl(data.result.img))
        await msg.say(FileBox.fromUrl(data.result.tts))
        console.log('Daily English data message sent successfully')
      } else {
        await msg.say('获取每日英语一句数据失败')
        console.error('Failed to get Daily English data:', data)
      }
    } catch (error) {
      console.error('Error sending Daily English data message:', error)
    }
  }

  async handleConstellations(msg) {
    try {
      const { data } = await fetchConstellationsData()
      if (data.code === 200) {
        await msg.say(FileBox.fromUrl(data.data))
        console.log('Constellations data message sent successfully')
      } else {
        await msg.say('获取星座运势数据失败')
        console.error('Failed to get Constellations data:', data)
      }
    } catch (error) {
      console.error('Error sending Constellations data message:', error)
    }
  }

  async handleGG(msg) {
    try {
      const { data } = await fetchBoyImage()

      if (data.code === 200) {
        const response = await axios({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
        })

        await msg.say(FileBox.fromBuffer(response.data, 'image.png'))
        console.log('Image sent successfully')
      } else {
        await msg.say('获取图片数据失败')
        console.error('Failed to get image data:', data)
      }
    } catch (error) {
      console.error('Error handling image:', error)
      await msg.say('处理图片时发生错误')
    }
  }

  async handleMM(msg) {
    try {
      const { data } = await fetchGirlImage()

      if (data.code === 200) {
        const response = await axios({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
        })

        await msg.say(FileBox.fromBuffer(response.data, 'image.png'))
        console.log('Image sent successfully')
      } else {
        await msg.say('获取图片数据失败')
        console.error('Failed to get image data:', data)
      }
    } catch (error) {
      console.error('Error handling image:', error)
      await msg.say('处理图片时发生错误')
    }
  }

  async handleHelp(msg) {
    // const commands = {
    //   '/ping': '发送 "pong" 以测试是否在线',
    //   '/moyu': '获取摸鱼人数据',
    //   '/sixs': '获取60秒新闻数据',
    //   '/de': '获取每日英语',
    //   '/cs': '获取今日星座运势',
    //   'tj': '添加股票',
    //   'ck': '查看添加过的股票',
    //   'sc': '删除添加过的股票',
    //   'tsgp': '推送股票',
    // }

    // let helpMessage = '可用命令：\n'
    // for (const [command, description] of Object.entries(commands)) {
    //   helpMessage += `${command} - ${description}\n`
    // }
    let helpMessage = '可用命令：\n'
    this.TASKS.forEach((task) => {
      // if (task.skip) {
        // return
      // }
      helpMessage += `[${task.keyword.join(' | ')}] - ${task.description}\n`
    })

    // await msg.say(helpMessage)
    await msg.say('你好')
  }

  async handleUnknown(msg) {
    await msg.say('未知命令，请使用 /help 查看可用命令')
  }

  async handleCDK(msg) {
    const usernames = new Set([
      'VIP666',
      'VIP888',
      'VIP2023',
      'xddq666',
      'xddq2023',
      'xddq2309',
      'xddqqq',
      'xddqzhw',
      'xddqgzh',
      'xddqfl',
      'XD123NBH6',
      'wgyx666',
      'cyg666',
      'cyg888',
      'zhendan666',
      'zz666',
      'zz888',
      'XD12YLH6',
      'DQ34QLH88',
      'QT666',
      'xdcjxqy',
      'xddqydkl',
      'fkxqyxd66',
      'cjxqyxd6',
      'dqdxyq8',
      'hylddqsj6',
      'xdhhgdn',
      'xdxxscl66',
      'xdhjak666',
      'xdwsry888',
      'xdlnkgdj66',
      'xdfnjfl66',
      'xdltj888',
      'xdxlh123',
    ])
    await msg.say([...usernames].join('\n'))
  }

  async handleRGV(msg) {
    try {
      const { data } = await fetchGirlVideo()
      if (data.result === 200) {
        await msg.say(FileBox.fromUrl('https:' + data.mp4))
        console.log('Random girl video message sent successfully')
      } else {
        await msg.say('获取随机小姐姐视频失败')
        console.error('Failed to get random girl video: Video URL not found')
      }
    } catch (error) {
      console.error('Error sending random girl video message:', error)
      await msg.say('获取随机小姐姐视频失败')
    }
  }

  async handleRandomBeautyGirlVideo(msg) {
    try {
      const { data } = await fetchRandomBeautyGirlVideo()
      if (data.code === '200') {
        await msg.say(FileBox.fromUrl(data.data))
        console.log('Random beauty girl video message sent successfully')
      } else {
        await msg.say('获取随机美少女视频失败')
        console.error('Failed to get random beauty girl video: Video URL not found')
      }
    } catch (error) {
      console.error('Error sending random beauty girl video message:', error)
    }
  }

  TASKS = [
    { keyword: ['/ping', 'ping'], description: `发送 "ping" 以测试[${botName}]是否在线`, func: this.handlePing},
    { keyword: ['/moyu', 'moyu', '摸鱼'], description: '获取摸鱼人数据', func: this.handleMoYu, },
    { keyword: ['/sixs', 'sixs'], description: '获取60秒新闻数据', func: this.handleSixs,  },
    { keyword: ['/dog', 'dog', '舔狗日记'], description: '获取舔狗日记', func: this.handleDog},
    { keyword: ['/de', 'de'], description: '获取每日英语', func: this.handleDailyEnglish},
    { keyword: ['/cs', 'cs'], description: '获取今日星座运势', func: this.handleConstellations},
    { keyword: ['/help', 'help', 'h'], description: '获取帮助信息', func: this.handleHelp, },
    { keyword: ['/gg', 'gg', '帅哥', 'giegie'], description: '获取随机帅哥', func: this.handleGG, },
    { keyword: ['/mm', 'mm', '美女', '妹妹'], description: '获取随机妹妹', func: this.handleMM, },
    { keyword: ['#CDK', '#兑换码', '兑换码'], description: '输出兑换码', func: this.handleCDK, skip: true },
    // { keyword: ['/rgv'], description: '获取随机小姐姐视频', func: this.handleRGV },
    { keyword: ['/rgv', '/rgbv', '小姐姐'], description: '获取随机美少女视频', func: this.handleRandomBeautyGirlVideo },
    { keyword: ['/mf', 'mf'], description: '发癫文学 需指定对应的名字', func: this.handleFetchFabing},
    { keyword: ['/draw', 'draw', '画'], description: '绘画 需指定关键词', func: this.handleGenerations },
    { keyword: ['/kfc', 'kfc', '50', 'v50', 'V50', 'KFC', '开封菜'], description: '随机疯狂星期四文案', func: this.handleFetchFkxqs },
    { keyword: ['/sl', 'sl', '少萝'], description: '随机少萝妹妹', func: this.handleSlVideo },
    { keyword: ['/yz', 'yz', '玉足', 'YZ'], description: '随机美腿玉足视频', func: this.handleYzVideo },
    { keyword: ['/jk', 'jk', 'JK'], description: '随机jk', func: this.handleFetchJK },
    { keyword: ['yiyan', 'yy', '每日一言', '一言'], description: '每日一言', func: this.handleFetchYiYan },
    {keyword: ['/今日推荐股票'], description: '推荐今日股票（建议交易日9:25以后再问）', func: this.handleFetchStockCode, skip: true},
    {keyword: ['/同花顺'], description: '推荐今日股票', func: this.handleTHS, skip: true},
    {keyword: ['/tj','tj'], description: '添加股票----比亚迪 200', func: this.handleTJ, skip: true},
    {keyword: ['/ck','ck'], description: '查看股票', func: this.handleCK, skip: true},
    {keyword: ['/sc','sc'], description: '删除股票----比亚迪', func: this.handleSC, skip: true},
    {keyword: ['/tsgp','tsgp'], description: '推送股票', func: this.handleTSGP, skip: true},
  ]

  async handleTSGP(msg) {

    function getStockExchanges(stockCodes) {
      const result = [];
  
      stockCodes.forEach(code => {
          if (code.startsWith('60')) {
              result.push(0);  //上海证券交易所 (上交所)
          } else if (code.startsWith('00')) {
              result.push(0);    //'深圳证券交易所 (深交所) 主板'
          } else if (code.startsWith('300')) {
              result.push(1);    //深圳证券交易所 (深交所) 创业板
          } else if (code.startsWith('8')) {
              result.push(2);     //北京证券交易所 (北交所)
          } else {
              result.push(-1);
          }
      });
  
      return result;
    }
  
    try {
        const content = msg.text()
        const {parameters} = parseCommand(content)
        let txt0 = '===========上交所===========\n';
        let txt1 = '\n\n\n===========深交所===========';
        let txt2 = '\n\n\n===========创业板===========';
        let txt3 = '===========北交所===========\n';
        let name = parameters[0];
        if (!name) {
            const contact = msg.talker() // 发消息人
            name = await contact.name() // 发消息人昵称
        }
        const {data} = await fetchTSGP()
        const exchanges = getStockExchanges(Object.values(data["股票代码"]).map(code => code.split('.')[0]));
        for(let i=0;i<Object.values(data["股票简称"]).length;i++){
          if(exchanges[i]==0){
            txt0 +="股票简称: " + data["股票简称"][i] + ',股票代码: ' + data["股票代码"][i] + '\n'
          }else if(exchanges[i]==1){
            txt1 +="股票简称: " + data["股票简称"][i] + ',股票代码: ' + data["股票代码"][i] + '\n'
          }else if (exchanges[i]==2) {
            txt2 +="股票简称: " + data["股票简称"][i] + ',股票代码: ' + data["股票代码"][i] + '\n'
          }else{
            txt3 +="股票简称: " + data["股票简称"][i] + ',股票代码: ' + data["股票代码"][i] + '\n'
          }
        }
        await msg.say((txt0+txt1+txt2+txt3).slice(0,-1))
    } catch (error) {
        console.error('Error sending random girl video message:', error)
        await msg.say("推送失败")
    }
  }

  async handleSC(msg) {
    try {
        const content = msg.text()
        const {parameters} = parseCommand(content)
        let name = parameters[0];
        if (!name) {
            const contact = msg.talker() // 发消息人
            name = await contact.name() // 发消息人昵称
        }
        const room = msg.room();
        const roomName = (await room?.topic()) || null // 群名称
        const {data} = await fetchSC(roomName, content.split(" ")[1].split(" ")[1])
        await msg.say(data.data)
    } catch (error) {
        console.error('Error sending random girl video message:', error)
        await msg.say("删除失败")
    }
  }

  async handleCK(msg) {
      try {
          const content = msg.text()
          const {parameters} = parseCommand(content)
          let name = parameters[0];
          if (!name) {
              const contact = msg.talker() // 发消息人
              name = await contact.name() // 发消息人昵称
          }
          const room = msg.room();
          const roomName = (await room?.topic()) || null // 群名称
          const {data} = await fetchCK(roomName)
          var str_res = "";
          str_res = data.map(item => item.info.toString()+"\n").toString().replaceAll(",","")
          if (str_res==""){
            await msg.say("还没有记录")
          }else{
            await msg.say(str_res)
          }
      } catch (error) {
          console.error('Error sending random girl video message:', error)
          await msg.say("读取记录失败")
      }
  }

  async handleTJ(msg) {
      try {
          const content = msg.text()
          const {parameters} = parseCommand(content)
          let name = parameters[0];
          if (!name) {
              const contact = msg.talker() // 发消息人
              name = await contact.name() // 发消息人昵称
          }
          const room = msg.room();
          const roomName = (await room?.topic()) || null // 群名称
          const data = content.split(" ")[1].split(" ").slice(1,content.split(" ")[1].split(" ").length).toString()
          if (data===''){
            await msg.say("不能添加空的信息")
          }else{
            const res = await fetchTJ(roomName, data)
            if (res.status == 200){
              await msg.say("添加成功")
            }
          }
      } catch (error) {
          console.error('Error sending random girl video message:', error)
          await msg.say("添加失败")
      }
  }

  async handleTHS(msg) {
      try {
          const content = msg.text()
          const {parameters} = parseCommand(content)
          let name = parameters[0];
          if (!name) {
              const contact = msg.talker() // 发消息人
              name = await contact.name() // 发消息人昵称
          }
          const res = await fetchTHS(name)
          await msg.say(data)
      } catch (error) {
          console.error('Error sending random girl video message:', error)
      }
  }

  async handleFetchStockCode(msg) {
      try {
          const content = msg.text()
          const {parameters} = parseCommand(content)
          let name = parameters[0];
          if (!name) {
              const contact = msg.talker() // 发消息人
              name = await contact.name() // 发消息人昵称
          }
          const {data} = await fetchStockCode(name)
          await msg.say(data)
      } catch (error) {
          console.error('Error sending random girl video message:', error)
      }
  }

  async handleSlVideo(msg) {
    try {
      const res = await getRedirectUrl(endpointsMap.get('sl'))
      await msg.say(FileBox.fromUrl(res))
    } catch (error) {
      console.error('Error sending random girl video message:', error)
      await msg.say('少萝妹妹下载失败')
    }
  }

  async handleYzVideo(msg) {
    try {
      const res = await getRedirectUrl(endpointsMap.get('yz'))
      await msg.say(FileBox.fromUrl(res))
    } catch (error) {
      console.error('Error sending random girl video message:', error)
      await msg.say('玉足妹妹下载失败')
    }
  }

  async handleFetchFabing(msg) {
    try {
      const content = msg.text()
      const { parameters } = parseCommand(content)
      let name = parameters[0]
      if (!name) {
        const contact = msg.talker() // 发消息人
        name = await contact.name() // 发消息人昵称
      }
      const { data } = await fetchFabingData(name)
      console.log('🚀 ~ MessageHandler ~ handleFetchFabing ~ data:', data)
      if (data.code === 1) {
        await msg.say(data.data)
      } else {
        console.error('Failed to get random girl video: Video URL not found')
      }
    } catch (error) {
      console.error('Error sending random girl video message:', error)
    }
  }

  async handleGenerations(msg) {
    try {
      const content = msg.text()
      const { parameters } = parseCommand(content)
      let prompt = parameters.join(' ')
      console.log('🚀 ~ MessageHandler ~ handleGenerations ~ prompt:', prompt)
      await msg.say('绘画中...')
      const { data } = await fetchGenerationsData(prompt)
      if (data.data && data.data.length) {
        await msg.say(FileBox.fromUrl(data.data[0].url))
      } else {
        console.error('Failed to get random girl video: Video URL not found')
        throw '绘画失败'
      }
    } catch (error) {
      console.error('Error sending random girl video message:', error)
      await msg.say('绘画失败')
    }
  }

  async handleGenerations(msg) {
    try {
      const content = msg.text()
      const { parameters } = parseCommand(content)
      let prompt = parameters.join(' ')
      console.log('🚀 ~ MessageHandler ~ handleGenerations ~ prompt:', prompt)
      await msg.say('绘画中...')
      const response = await createSpackPicture(prompt, env.APP_ID, env.API_KEY, env.API_SECRET)
      if (response) {
        const url = parseMessage(response)
        const currentFilePath = fileURLToPath(import.meta.url)
        const currentDirPath = dirname(currentFilePath)
        console.log("🚀 ~ MessageHandler ~ handleGenerations ~ url:", join(currentDirPath, url))
        if (url) {
          await msg.say(FileBox.fromUrl(join(currentDirPath, url)))
        } else {
          throw '绘画失败'
        }
      } else {
        throw '绘画失败'
      }
    } catch (error) {
      console.error('Error sending random girl video message:', error)
      await msg.say('绘画失败')
    }
  }

  async handleFetchJK(msg) {
    try {
      const res = await fetchJKData()
      await msg.say(FileBox.fromBuffer(res.data, 'image.jpeg'))
    } catch (error) {
      // 在出现错误时，确保传递给 msg.say 的内容是一个字符串
      await msg.say('图片解析失败')
    }
  }

  async handleFetchYiYan(msg) {
    try {
      const res = await fetchYiYanData()
      const result = res.data.replace(/<[^>]*>/g, '')
      await msg.say(result.trim())
    } catch (error) {
      await msg.say('每日一言获取失败')
    }
  }

  async handleFetchFkxqs(msg) {
    try {
      const { data } = await fetchFkxqsData()
      if (typeof data === 'string') {
        await msg.say(data)
      } else {
        console.error('获取疯狂星期四文案失败：文案未找到')
        throw new Error('获取疯狂星期四文案失败：文案未找到')
      }
    } catch (error) {
      console.error('发送疯狂星期四文案消息时出错：', error)
      // 在出现错误时，确保传递给 msg.say 的内容是一个字符串
      await msg.say('获取疯狂星期四文案失败，请稍后再试。')
    }
  }

  async handleMessage(msg,isRoom=false) {
    if (isRoom) {
      const content = msg.text().replace(`@${botName}`, '').replace(" ","")
      const { instruction } = parseCommand(content)
      for (const task of this.TASKS) {
        if (task.keyword.includes(instruction)) {
          await task.func.call(this, msg)
          return
        }
      }
      await this.handleUnknown(msg)
    }else{
      const content = msg.text()
      const { instruction } = parseCommand(content)
      for (const task of this.TASKS) {
        if (task.keyword.includes(instruction)) {
          await task.func.call(this, msg)
          return
        }
      }
      await this.handleUnknown(msg)
    }
  }

  async handleExportVideo(token, msg) { 
    var imgList = [];
    var jsonData = {};
    //获取用户token
    jsonData.token = token;
    let urlInput = msg.text()
    //提取文本中的URL链接
    var regex = /(http[s]?:\/\/[^\s,，]+)/g;
    var matches = urlInput.match(regex);
    if (matches) {
        urlInput = matches[0];
    } else {
        // $("#inputPrompt").html('解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>').show();
        $("#downloadButton").prop('disabled', false);

        var dynamicContent = '解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>';
        showButtonModel(dynamicContent);
        return;
    }

    jsonData.url = urlInput;

    //请求后缀
    const suffix = "video/parseVideoUrl";

    if (urlInput.indexOf(".bilibili.com") !== -1 || urlInput.indexOf("b23.tv") !== -1) {
        jsonData.platform = "bilibili";
        // suffix = "blbl/parse";
        // var newButton = $('<button id="downloadHdLink" class="btn btn-success ms-1 me-1 mt-2">下载高清</button>');
        // $("#downloadLink").text("下载标清").before(newButton);
        // $("#inputPrompt").text("bilibili视频解析正在修复，给您带来不便，非常抱歉！").show();
        // return;



    } else if (urlInput.indexOf("douyin.com") !== -1) {

        // 提取抖音分享链接
        // var regex = /(https:\/\/www\.douyin\.com\/video\/\d+)|(https:\/\/v\.douyin\.com\/[a-zA-Z0-9]+\/)/g;
        // urlInput = urlInput.match(regex)[0];
        jsonData.platform = "douyin";
        if (urlInput.indexOf("douyin.com/search") !== -1) {
            var dynamicContent = '暂不支持抖音搜索链接下载，请重新输入！';
            showButtonModel(dynamicContent);
            return;
        }
    } else if (urlInput.indexOf("kuaishou.com") !== -1) {
        jsonData.platform = "kuaishou";
    } else if (urlInput.indexOf("pipix.com") !== -1) {
        jsonData.platform = "pipix";
    } else if (urlInput.indexOf("www.xiaohongshu.com") !== -1 || urlInput.indexOf("xhslink.com") !== -1) {
        jsonData.platform = "xhs";
    } else if (urlInput.indexOf("tiktok.com") !== -1) {
        jsonData.platform = "tiktok";
    } else if (urlInput.indexOf("ixigua.com") !== -1) {
        jsonData.platform = "xigua";
    }  else if (urlInput.indexOf("weishi.qq.com") !== -1) {
        jsonData.platform = "weishi";
    } else if (urlInput.indexOf("weibo.com") !== -1) {
        jsonData.platform = "weibo";
    } else if (urlInput.indexOf("jd.com") !== -1 || urlInput.indexOf("3.cn") !== -1) {
        jsonData.platform = "jingdong";
    }  else if (urlInput.indexOf("youtu.be") !== -1 || urlInput.indexOf("youtube.com") !== -1) {
        jsonData.platform = "youtube";
    } else if (urlInput.indexOf("hao123.com") !== -1 || urlInput.indexOf("haokan.baidu.com") !== -1) {
        jsonData.platform = "haokan";
    } else {
        // $("#inputPrompt").html('解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>').show();
        //解除重新解析按钮限制
        $("#downloadButton").prop('disabled', false);
        $("#waitAnimation").hide();

        var dynamicContent = '解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>';
        showButtonModel(dynamicContent);
        return;
    }

    var params = JSON.stringify(jsonData);

    var encryptParams = encrypt(params);
    jsonData.params= encryptParams;

    // 发起 POST 请求
    axios.post('https://www.xiazaitool.com/' + suffix, JSON.stringify(jsonData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'timestam': new Date().getTime()
      }
    })
    .then(res => {
      const dataObject = res.data;

      if (res.status !== 200) {
        if (response.status === 500 || response.status === 407) {

          let message = response.data.message;
          if ($.trim(message).length !== 0) {
            if (response.status === 407) {
              let buttonTwo = '<a href="https://www.xiazaitool.com/openmember" target="_blank"><button type="button" class="btn btn-success">去开通</button></a>';
            } else {
              let buttonTwo = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">确定</button>';
            }
            showModel(message, buttonTwo);
          } else {
            let dynamicContent = '解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>';
            showButtonModel(dynamicContent);
          }
          $("#waitAnimation").hide();
          return;
        } else if (response.status === 748) {
          // 调用验证码
        } else {
          let dynamicContent = '未知错误，请重试，或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>';
          showButtonModel(dynamicContent);
        }
      }
      imgList = dataObject.data.voideDeatilVoList;
      if(dataObject.data.title != null){
        msg.say(dataObject.data.title) // 向群聊发送title
      }
      try {
        const urls = dataObject.data.voideDeatilVoList
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const promises = urls.map(async (url, index) => {
          try {
            if (url.type=='video') {
              try {
                    const response = await axios({
                      url: url.url,
                      method: 'GET',
                      responseType: 'stream' // 确保 responseType 是 'stream'
                    })
        
                    console.log(`响应状态码: ${response.status} for URL: ${url}`); // 输出响应状态码
                    console.log(`响应头: ${JSON.stringify(response.headers)} for URL: ${url}`); // 输出响应头
        
                    if (!response.data) {
                      throw new Error(`响应数据为空 for URL: ${url}`);
                    }
        
                    const filePath = path.join(__dirname, `temp_video_${index + 1}.mp4`)
                    const writer = fs.createWriteStream(filePath)
                    response.data.pipe(writer)
        
                    return new Promise((resolve, reject) => {
                      writer.on('finish', async () => {
                        const fileBox = FileBox.fromFile(filePath)
                        await msg.say(fileBox) // 向群聊发送视频
                        fs.unlinkSync(filePath) // 删除临时文件
                        resolve()
                      })
        
                      writer.on('error', reject)
                    })
              } catch (error) {
                console.error('处理视频列表失败:', error)
              }
            }else{
              const response = await axios({
                url: url.url,
                method: 'GET',
                responseType: 'stream' // 确保 responseType 是 'stream'
              })
  
              console.log(`响应状态码: ${response.status} for URL: ${url}`); // 输出响应状态码
              console.log(`响应头: ${JSON.stringify(response.headers)} for URL: ${url}`); // 输出响应头
  
              if (!response.data) {
                throw new Error(`响应数据为空 for URL: ${url}`);
              }
  
              const filePath = path.join(__dirname, `temp_image_${index + 1}.jpg`)
              const writer = fs.createWriteStream(filePath)
              response.data.pipe(writer)
  
              return new Promise((resolve, reject) => {
                writer.on('finish', async () => {
                  const fileBox = FileBox.fromFile(filePath)
                  await msg.say(fileBox) // 向群聊发送图片
                  fs.unlinkSync(filePath) // 删除临时文件
                  resolve()
                })
                // writer.on('error', reject)
              })
            }
          } catch (error) {
            console.error(`下载图片失败 for URL: ${url}`, error)
            throw error
          }
        })

        Promise.all(promises)
      } catch (error) {
        console.error('处理图片列表失败:', error)
      }
      // for (let index = 0; index < imgList.length; index++) {
      //   const element = imgList[index].url;
      //   try {
      //     // 下载图片
      //     const response = axios({
      //       url: element,
      //       method: 'GET',
      //       responseType: 'stream' // 确保 responseType 是 'stream'
      //     })

      //     if (!response.data) {
      //       throw new Error('响应数据为空');
      //     }
      //     // 获取当前文件的目录路径
      //     const __dirname = path.dirname(fileURLToPath(import.meta.url))
      //     const filePath = path.join(__dirname, 'temp_image'+index+'.jpg')
      //     const writer = fs.createWriteStream(filePath)
      //     response.data.pipe(writer)
  
      //     new Promise((resolve, reject) => {
      //       writer.on('finish', async () => {
      //         const fileBox = FileBox.fromFile(filePath)
      //         await room.say(fileBox) // 向群聊发送图片
      //         fs.unlinkSync(filePath) // 删除临时文件
      //         resolve()
      //       })
  
      //       writer.on('error', reject)
      //     })
      //   } catch (error) {
      //     console.error('下载图片失败:', error)
      //   }
      // }
    })
    .catch(error => {
      if (error.response && error.response.status === 406) {
        alert("请求太过频繁，请稍后重试");
      }
      // 失败提示
      let dynamicContent = '解析失败，请重试并检查链接是否有效&emsp;查看&nbsp;<a href="https://www.xiazaitool.com/jiaocheng" target="_blank">使用教程</a>&nbsp;或&nbsp;<a href="https://www.xiazaitool.com/fankui" target="_blank">联系我们</a>';
      // 解析完成，允许点击重新解析按钮
      console.log("发生错误:", error);
    });
  }

  isIncludesKeyword(content) {
    const { instruction } = parseCommand(content)
    return this.TASKS.some((task) => {
      return task.keyword.some((keyword) => {
        return keyword === instruction
      })
    })
  }
}

// const handle = new MessageHandler({})
// const res = handle.isIncludesKeyword('/mf hhh')
// console.log("🚀 ~ res:", res)

export class MessageSender {
  constructor(wechaty) {
    this.wechaty = wechaty
  }

  async sendMessage(data) {
    // if (!this.wechaty) {
    //   console.log('Wechaty instance is not provided.')
    //   return
    // }
    if (data.type === 'room') {
      await this.sendToRoom(data)
    } else {
      console.log('Invalid message type in JSON.')
    }
  }

  async sendToRoom(data) {
    const room = await this.wechaty.Room.find({ id: data.roomId })
    if (room) {
      await room.say(data.message)
    } else {
      console.log(`Room ${data.roomId} not found.`)
    }
  }

  async loadTasksFromJSON(jsonFilePath) {
    try {
      const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
      const tasks = JSON.parse(jsonData)
      console.log('🚀 ~ MessageSender ~ loadTasksFromJSON ~ tasks:', tasks)
      for (const task of tasks) {
        await this.sendMessage(task)
      }
    } catch (error) {
      console.error('Error loading tasks from JSON:', error)
    }
  }
}

// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);
// const messageSender = new MessageSender(null)
// messageSender.loadTasksFromJSON(join(currentDirPath, '..', 'tasks', 'tasks.json'))
