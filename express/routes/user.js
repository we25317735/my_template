import express from 'express'

// 對資料庫操作
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 中介軟體，存取隱私會員資料用(老師寫的不知啥鬼)
import authenticate from '#middlewares/authenticate.js'
import { getIdParam } from '#db-helpers/db-tool.js' // 檢查空物件, 轉換req.params為數字

const router = express.Router()

// GET - 得到所有會員資料
router.get('/', async function (req, res) {
  const users = await User.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { users } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', authenticate, async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  console.log('後端取得: ', id)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const user = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼
  delete user.password

  return res.json({ status: 'success', data: { user } })
})

// email 搜尋使用者
router.get('/email/:email', async function (req, res) {
  const { email } = req.params

  console.log('使用者信箱: ', email)

  const user = await User.findOne({
    where: { email: email }, // 使用 email 查詢
    raw: true, // 只需要資料表中的資料
  })

  // 如果查無會員資料
  if (!user) {
    return res.json({ status: 'error', message: '查無會員資料' })
  }

  // 把使用者名稱跟 email 返回
  const data = {
    email: user.email,
    name: user.name,
  }

  return res.json({ status: 'success', data })
})

// 電話 搜尋使用者
router.get('/phone/:phone', async function (req, res) {
  const { phone } = req.params

  console.log('使用者電話: ', phone)

  const user = await User.findOne({
    where: { phone: phone }, // 使用 email 查詢
    raw: true, // 只需要資料表中的資料
  })

  // 如果查無會員資料
  if (!user) {
    return res.json({ status: 'error', message: '查無會員資料' })
  }

  // 把使用者名稱跟電話返回
  const data = {
    phone: user.phone,
    name: user.name,
  }

  return res.json({ status: 'success', data })
})

/* 寄送email的路由 */
router.post('/email', function (req, res) {
  const { email } = req.body
  console.log('後端收到: ', email)

  const redirectUrl = `http://localhost:3000/login/recover?id=${id}&name=${encodeURIComponent(name)}&account=${encodeURIComponent(account)}` // 你的導引連結

  // 更新 mailOptions，將訊息與連結包含在信件內容中
  const mailOptions = {
    from: `"I GOT BREW"<${process.env.SMTP_TO_EMAIL}>`,
    to: 'harry08270712@gmail.com',
    subject: 'IGotBrew 給忘記密碼的使用者',
    text: `
      親愛的 ${name} 先生/女士,

      您的驗證碼為

      
    // `,
  }

  // 寄送
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      return res.status(400).json({ status: 'error', message: err })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

export default router
