import express from 'express'
import sequelize from '#configs/db.js'
import { Op } from 'sequelize' // 確保 Sequelize 的 Op 正確匯入
const { Conversations, Messages } = sequelize.models // 聊天室

const router = express.Router()

// 連線成功, 搜尋/新增 對話框
router.get('/check_conversation/:user1/:user2', async function (req, res) {
  const { user1, user2 } = req.params
  console.log('兩個id: ', user1, user2) // 預設 user1 為管理員

  if (!user1 || !user2) return

  // 查詢兩個使用者的對話紀錄表
  let conversation_Data = await Conversations.findOne({
    where: {
      [Op.or]: [
        { user_id_1: user1, user_id_2: user2 },
        { user_id_1: user2, user_id_2: user1 },
      ],
    },
  })

  // console.log('找到對話紀錄: ', conversation_Data)

  // 如果沒有對話紀錄，先新增Conversations
  if (!conversation_Data) {
    // console.log('沒有對話紀錄，正在創建新的對話紀錄')

    const new_data = {
      user_id_1: user1, // 發送訊息的用戶ID
      user_id_2: user2, // 接收訊息的用戶ID
      created_at: new Date(), // 對話創建時間
      updated_at: new Date(), // 更新時間
    }

    // 新增對話紀錄
    conversation_Data = await Conversations.create(new_data)
    // console.log('新對話紀錄已創建:', conversation_Data.conversation_id)
  }

  // 返回對話紀錄
  return res.json({
    conversation_id: conversation_Data.conversation_id,
    status: 200,
  })
})

// 查詢對話紀錄
router.get('/:msg', async function (req, res) {
  const { msg } = req.params
  // console.log('conversation 的 id: ', msg)

  // 搜尋同個 id 的對話紀錄
  const conversation_Data = await Messages.findAll({
    where: {
      conversation_id: msg,
    },
  })

  // console.log('找到所有對話紀錄: ', conversation_Data)

  // 返回對話紀錄
  return res.json({
    messages: conversation_Data,
    state: 200,
  })
})

// 把訊息送往資料庫(即使對方下線也能傳送訊息)
router.post('/offline', async function (req, res) {
  const { user_id, user_name, message, recipient_id } = req.body
  console.log('把留言送往資料庫: ', user_id, user_name, message, recipient_id)

  // 查詢和對方的對話框
  let conversation_Data = await Conversations.findOne({
    where: {
      [Op.or]: [
        { user_id_1: user_id, user_id_2: recipient_id },
        { user_id_1: recipient_id, user_id_2: user_id },
      ],
    },
  })

  // 新增訊息到Messages資料表
  const messageData = {
    conversation_id: conversation_Data.conversation_id, // 對話與聊天室關聯起來
    sender_id: user_id, // 發送訊息者的ID
    sender_name: user_name,
    accept_id: recipient_id, // 接收訊息者的ID
    message: message, // 訊息內容
    created_at: new Date(), // 訊息創建時間
    updated_at: new Date(), // 訊息更新時間
  }

  await Messages.create(messageData)
  console.log('訊息已存入資料庫')

  // 返回對話紀錄
  return res.json({
    msg: '訊息已儲存',
    status: 200,
  })
})

export default router
