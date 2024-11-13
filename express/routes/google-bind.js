import express from 'express'
const router = express.Router()

import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

router.post('/', async function (req, res, next) {
  // providerData =  req.body
  // console.log('wlkwd ', JSON.stringify(req.body))

  const { user_id, displayName, uid } = req.body
  console.log('綁定 google 後端: ', user_id, displayName, uid)

  if (!user_id || !uid) return

  // 1. 檢查是否已有其他使用者使用該 google_uid
  const existingUserWithLineUid = await User.findOne({
    where: { google_uid: uid },
  })

  if (existingUserWithLineUid) {
    return res.status(200).json({
      status: 'error',
      message: '該帳號已有人使用',
    })
  }

  // 2. 用使用者 id 搜尋該使用者
  const user = await User.findOne({
    where: { id: user_id },
  })

  await user.update({ google_uid: uid }) // 更新使用者的 line_uid

  // console.log('更新後的 user: ', user) // 看 line_id 有沒有進來

  return res.status(200).json({
    status: 'success',
    google_uid: uid, // 傳回去讓 setAuth 有東西渲染
    msg: '綁定成功 !',
  })
})

export default router
