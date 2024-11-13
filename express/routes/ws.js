import { Server as SocketIOServer } from 'socket.io'

// 對資料庫操作
import sequelize from '#configs/db.js'
import { Op } from 'sequelize' // 確保 Sequelize 的 Op 正確匯入
const { Conversations, Messages } = sequelize.models // 聊天室 + 留言

const onlineUsers = {} // 用於儲存連接的用戶
const allUsers = {} // 用於儲存所有曾經連線的用戶

/*
  這邊是課服 WebSocket 的邏輯
*/

export default function setupSocketIO(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001', // ws 第二個人(測試)
        'http://localhost:3002', // ws 管理員
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    // console.log('已開啟連線')

    // 使用者連線時, 提供資料
    socket.on('identify', (userData) => {
      // console.log('接收到的使用者資料:', userData)
      onlineUsers[socket.id] = userData // 儲存用戶資料
      allUsers[userData.user_id] = userData

      // 通知所有客戶端更新的用戶列表
      io.emit('updateUserList', Object.values(allUsers))

      // console.log('現有帳戶: ', onlineUsers)

      // 連線成功後傳送使用者資料做身分辨別
      const userData = {
        user_id: auth.userData.id,
        user_name: auth.userData.name,
      }
      socketRef.current.emit('identify', userData) // 到伺服器報到以上線
    })

    // 當接收到 'message' 事件時
    socket.on('message', async (data) => {
      console.log('收到訊息', data)

      // 用傳過來的 id 找到相應私聊對象的 Socket id
      const specify_SocketId = Object.keys(onlineUsers).find(
        (id) => onlineUsers[id].user_id === data.recipient_id
      )

      // 傳送訊息給指定的人
      if (specify_SocketId) {
        // 傳送訊息給接收者 (例如，管理員)
        io.to(specify_SocketId).emit('message', data)
        console.log('訊息已傳送給指定接收者', data.user_id, data.recipient_id)
      }
    })

    // 當連接中斷時
    socket.on('disconnect', () => {
      console.log('連線中斷')
      delete onlineUsers[socket.id] // 移除用戶
      io.emit('updateUserList', Object.values(onlineUsers)) // 通知所有客戶端更新的用戶列表
    })
  })
}
