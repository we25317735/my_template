import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 接收資料的中間件
const jsonModdleware = express.json()

// 資料庫使用
import { QueryTypes, Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 驗証加密密碼字串用
import { generateHash, compareHash } from '#db-helpers/password-hash.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// 檢查登入狀態用(有沒有用戶)
router.get('/check', authenticate, async (req, res) => {
  // 查詢資料庫目前的資料
  const user = await User.findByPk(req.user.id, {
    raw: true, // 只需要資料表中資料
  })

  // 檢查 user 是否存在
  if (!user) {
    return res.status(200).json({ status: 'error', message: '用戶不存在' })
  }

  // 不回傳密碼值
  delete user.password
  return res.json({ status: 'success', data: { user } })
})

// 一般帳號註冊
router.post('/register', jsonModdleware, async (req, res) => {
  const { email, name, password } = req.body
  console.log('後端登入收到: ', email, name, password)

  // 沒輸入反整, 返回錯誤(前端有判斷, 這邊寫保險)
  if (!email || !name || !password) {
    return res.json({ status: 'fail', msg: '請輸入完整' })
  }

  // 加密密碼後再存入資料庫
  // const hashedPassword = await generateHash(password)

  // 新增使用者資料
  const data = await User.create({
    email,
    name,
    password, // SQL有設定直接加密(所以這邊不用處理)
  })

  // 回傳成功訊息
  res.json({
    status: 'success',
    data: data, // 這裡可以選擇要回傳的資料，例如不回傳密碼
  })
})

// 一般帳號登入(手機, 信箱)
router.post('/login', async (req, res) => {
  const { account, password } = req.body

  // 沒輸入反整, 返回錯誤
  if (!account || !password) {
    return res.json({ status: 'fail', msg: '請輸入完整' })
  }

  // 查找用戶
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { email: account }, // 帳號比對 email
        { phone: account }, // 帳號比對 電話號碼
      ],
    },
  })

  // 檢查用戶是否存在
  if (!user) {
    return res.json({ status: 'fail', msg: '用戶不存在' })
  }

  // 比對密碼
  const hash_password = await compareHash(password, user.password)

  if (!hash_password) {
    return res.json({ status: 'fail', msg: '密碼錯誤' })
  }

  console.log('後端: ', password, hash_password)

  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  const returnUser = {
    id: user.id, // 主要是需要這個
    username: user.username,
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  res.json({
    status: 'success',
    data: { accessToken },
  })
})

router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

export default router
