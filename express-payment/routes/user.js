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

export default router
