# background

消息通知的渠道有很多，但市面上大部分都不适合我，因为平常 QQ 使用频繁，因此想用 QQ 来进行消息通知，但无奈 QQ 的诸多限制，实行起来并不容易，本项目使用 oicq 来进行消息的推送，本项目仅提供用于发送消息的最小版本


# 效果
![leftover](https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20221217185911-2022-12-17.png)


# 前置条件

您需要一个 QQ 号用来发送消息，接收消息的那个 QQ 号必须是用来发送消息的那个 QQ 号的好友，下文所说的 bot 均为用来发送消息的那个 QQ 号

# 登录

第一次登录会提示输入 ticket，打开控制台的提示的链接，收到滑动验证码提示后，可使用 https://github.com/mzdluo123/TxCaptchaHelper 协助获取ticket
也可用PC浏览器滑动，从开发者工具网络请求cap_union_new_verity中得到ticket

然后会生成一个文件夹，默认是当前工作目录下的data文件夹，之后登录就不需要验证了，当然很久没有登录会导致token过期，就会需要验证

# Usage

```shell
npm install notify-qq
```

```typescript
import { sendMsg, sendMsgWithCI } from 'notify-qq'

// from: bot的QQ帐号  password: bot的QQ密码  to: 接收消息的那个人的QQ号，content：消息内容，imagePath：发送的图片对应的地址（支持本地相对地址，相对于当前的工作目录，也支持线上https，base64），dataDir: 指定在哪个目录下面生成data文件夹，该文件夹是用来存储登录数据的文件夹，默认是在当前工作目录下生成data文件夹
//sendMsg(from: number, password: string, to: number, content: string, imagePath?: string, dataDir?: string)
sendMsg(123456789, 123456789, 123456788, 'hello', undefined, process.cwd())

// 将从环境变量中读取数据，仅能在CI环境下使用
// 可用的环境变量 FROM, PASSWORD, TO, CONTENT, IMAGE_PATH, DATA_DIR ，一一对应上面的参数
sendMsgWithCI()
```
