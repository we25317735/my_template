import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'

import sequelize from '#configs/db.js'
const { User } = sequelize.models

// line-login模組(server 伺服器資料夾裡)
import line_login from '#services/line-login.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
// line 登入使用
const channel_id = '2006397281'
const channel_secret = '6a6204c4044c705889366e89553ed027'
const callback_url = 'http://localhost:3000/user'

// 綁定帳號的 channel
const LineLogin = new line_login({
  channel_id,
  channel_secret,
  callback_url,
  scope: 'openid profile',
  prompt: 'consent',
  bot_prompt: 'normal',
})

// ------------ 以下為路由 ------------
// 跟登入的那邊長的一樣, 只有頻道(channel)不一樣
router.get('/login', LineLogin.authJson())

// Line 綁定 callback 路由, 在這邊取得 line_uid
router.post(
  '/callback',
  LineLogin.callback(
    async (req, res, next, token_response) => {
      // 檢查 req.body 中是否有 id
      const { id } = req.body

      // 取得 LINE 回傳的 line_uid
      const line_uid = token_response.id_token.sub
      console.log('取得 LINE 使用者 ID:', line_uid)
      console.log('收到的使用者 ID:', id)

      if (!id) {
        return res.status(200).json({
          status: 'other',
          message: 'line發生錯誤, 請稍後在試',
        })
      }

      // 1. 檢查是否已有其他使用者使用該 line_uid
      const existingUserWithLineUid = await User.findOne({
        where: { line_uid: line_uid },
      })

      if (existingUserWithLineUid) {
        return res.status(200).json({
          status: 'error',
          message: '該帳號已有人使用',
        })
      }

      // 2. 用使用者 id 搜尋該使用者
      const user = await User.findOne({
        where: { id: id },
      })

      await user.update({ line_uid }) // 更新使用者的 line_uid

      // console.log('更新後的 user: ', user) // 看 line_id 有沒有進來

      return res.status(200).json({
        status: 'success',
        line_uid: line_uid,
        msg: '綁定成功 !',
      })
    },
    (req, res, next, error) => {
      console.error('LINE login failed:', error)
      return res.json({
        status: 'error',
        message: 'LINE 登入失敗',
      })
    }
  )
)

export default router
