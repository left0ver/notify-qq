import process from 'process'
import path from 'path'
import { createClient, Platform, segment } from 'oicq'
import type { Sendable, Client } from 'oicq'

async function send(bot: Client, to: number, content: string, imagePath?: string) {
  const isFriend = bot.fl.get(to) !== undefined
  if (!isFriend) {
    throw new Error(`the target user ${to} is not the bot ${bot.uin} friend , please add ${to} as friend`);
    // TODO：询问是否要添加为好友
  }
  const commonMessage: Sendable = [
    segment.text(content)
  ]
  const imageMessage = [
    // 相对于当前的工作目录
    segment.image(imagePath || ''),
  ]
  // 要发送的消息
  let sendMessage: Sendable = commonMessage
  if (imagePath) {
    sendMessage.push(...imageMessage)
  }
  await bot.pickFriend(to).sendMsg(sendMessage)
}


export function sendMsg(from: number, password: string, to: number, content: string, imagePath?: string, dataDir?: string) {

  const bot = createClient(from, {
    platform: Platform.Android,
    data_dir: dataDir || path.resolve(process.cwd(), 'data')
  })

  bot
    .on('system.login.slider', function () {
      console.log('输入ticket：')
      process.stdin.once('data', ticket =>
        this.submitSlider(String(ticket).trim()),
      )
    })
    .login(password)

  bot.on("system.login.device", async () => {

    await new Promise((resolve, reject) => {
      bot.logger.mark("输入密保手机收到的短信验证码后按下回车键继续。");
      bot.sendSmsCode();
      process.stdin.once("data", (input) => {
        bot.submitSmsCode(input.toString());
        resolve(true);
      });
    });
    bot.login(password);
  });


  bot.on('system.online', async () => {

    const dirArr = bot.dir.split(path.sep)
    console.log(`current data directory: ${dirArr.slice(0, dirArr.length - 1).join(path.sep)}`)

    send(bot, to, content, imagePath).then(res => {
      console.log('send message successful')
      bot.logout()
      console.log('logout successful')
    }).catch((error) => {
      console.log(error)
    })
  })

  bot.on("system.offline.kickoff", () => {
    console.error('server kicked offline')
  })

  bot.on("system.offline.network", () => {
    console.error("network error lead to offline")
  })
}

export function sendMsgWithCI() {
  const { FROM, PASSWORD, TO, CONTENT, IMAGE_PATH, DATA_DIR } = process.env
  if (!FROM || !PASSWORD) {
    throw new Error("the send message robot's account or password is missing");
  }
  if (!TO) {
    throw new Error("target user qq account is missing");
  }
  if (!CONTENT) {
    throw new Error("the send content is missing");
  }
  sendMsg(parseInt(FROM, 10), PASSWORD, parseInt(TO, 10), CONTENT, IMAGE_PATH, DATA_DIR)
}
