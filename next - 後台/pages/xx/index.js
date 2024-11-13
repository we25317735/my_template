import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { getMessage, check_conversation, offline } from '@/services/messgae' // 訊息 api
import { Get_AllUser } from '@/services/user'
import Link from 'next/link'
import io from 'socket.io-client'

const AdminChat = () => {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([]) // 儲存所有用戶
  const [selectedUser, setSelectedUser] = useState('') // 目前選擇的用戶
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    // Create Socket.IO connection
    socketRef.current = io('http://localhost:3005')

    socketRef.current.on('connect', async () => {
      let res = await Get_AllUser()
      let user_data = res.data.data.users.map((e) => {
        return { id: e.id, name: e.name }
      })

      setOnlineUsers(user_data)

      const userData = { user_id: 1, user_name: '管理員' }
      socketRef.current.emit('identify', userData)
    })

    socketRef.current.on('message', (data) => {
      const { user_name, message } = data
      setMessages((prevMessages) => ({
        ...prevMessages,
        [user_name]: [
          ...(prevMessages[user_name] || []),
          `${user_name}: ${message}`,
        ],
      }))
    })

    socketRef.current.on('disconnect', () => console.log('Socket.io 已斷線'))
    socketRef.current.on('error', (error) =>
      console.error('Socket.io 發生錯誤:', error)
    )

    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedUser) return

    const fetchChatHistory = async () => {
      const user = onlineUsers.find((u) => u.name === selectedUser)
      if (user) {
        const conversation = await check_conversation(`1/${user.id}`)
        const conversation_id = conversation.data.conversation_id
        const messages = await getMessage(`/${conversation_id}`)
        const history_msg = messages.data.messages
        const dialogue = history_msg.map(
          (e) => `${e.sender_name}: ${e.message}`
        )

        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser]: dialogue,
        }))
      }
    }

    fetchChatHistory()
  }, [selectedUser])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }, [messages[selectedUser]])

  const sendMessage = async () => {
    if (messageInput.trim() === '' || !selectedUser) return

    const userId = onlineUsers
      .filter((user) => user.name === selectedUser)
      .map((user) => user.id)[0]

    const message = {
      user_id: 1,
      user_name: '管理員',
      message: messageInput,
      recipient_id: userId,
    }

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message', message)
      await offline(message)

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser]: [
          ...(prevMessages[selectedUser] || []),
          `管理員: ${messageInput}`,
        ],
      }))
      setMessageInput('')
    } else {
      console.error('Socket.io 連線尚未開啟或已斷線')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="container mt-5">
      <h1>管理員客服中心</h1>
      <div className="row mt-4">
        {/* Conversation Section (Left) */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">
                對話框 - {selectedUser || '選擇用戶開始對話'}
              </h4>
              <div
                ref={messagesEndRef}
                className="border p-2"
                style={{ height: '50vh', overflowY: 'auto' }}
              >
                {messages[selectedUser]?.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
              <div className="input-group mt-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入訊息"
                  className="form-control"
                  disabled={!selectedUser}
                />
                <button
                  className="btn btn-primary"
                  onClick={sendMessage}
                  disabled={!selectedUser}
                >
                  發送
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Selection Section (Right) */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">選擇聊天對象</h4>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="form-select mb-3"
              >
                <option value="">選擇用戶</option>
                {onlineUsers
                  .filter((user) => user.name !== '管理員')
                  .map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
              </select>
              <h4 className="card-title">上線用戶</h4>
              <ul className="list-group">
                {onlineUsers
                  .filter((user) => user.name !== '管理員')
                  .map((user) => (
                    <li
                      key={user.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminChat
