import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import { getMessage } from '@/services/messgae' // 訊息 api
import Link from 'next/link'
import io from 'socket.io-client'

const Customer = () => {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const { auth, setAuth, handleCheckAuth } = useAuth()

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const router = useRouter()

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth()
  }, [setAuth, router])

  useEffect(() => {
    // 創建 Socket.IO 連線
    socketRef.current = io('http://localhost:3005')

    socketRef.current.on('connect', async () => {
      console.log('Socket.io 已連線')

      // 連線成功後傳送使用者資料做身分辨別
      const userData = {
        user_id: auth.userData.id,
        user_name: auth.userData.name,
      }
      socketRef.current.emit('identify', userData) // 發送資料到伺服器

      // 調出過去的對話紀錄(如果有登入才調資料)
      if (auth.userData.id) {
        let str = auth.userData.id // 使用者的 id
        const res = await getMessage(`1/${str}`) // 調資料, 管理員和誰的對話

        let dialogue = res.data.messages.map(
          (e) => `${e.sender_name}: ${e.message}`
        )

        setMessages(dialogue) // 更新狀態以顯示歷史訊息
      }
    })

    // 收到訊息後處理
    socketRef.current.on('message', (data) => {
      const { user_name, message } = data

      // 更新訊息狀態
      setMessages((prevMessages) => [
        ...prevMessages,
        `${user_name}: ${message}`,
      ])
    })

    socketRef.current.on('disconnect', () => {
      console.log('Socket.io 已斷線')
    })

    socketRef.current.on('error', (error) => {
      console.error('Socket.io 發生錯誤:', error)
    })

    // 清理函數
    return () => {
      socketRef.current.disconnect()
    }
  }, [auth.userData]) // 確保在用戶資料變化後重新建立連線

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  const sendMessage = () => {
    if (messageInput.trim() === '') return

    // 傳到後端的訊息(包括留言)
    const message = {
      user_id: auth.userData.id,
      user_name: auth.userData.name,
      message: messageInput,
      recipient_id: 1, // 接收訊息者的ID
    }

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message', message)
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
    <div>
      <h1>這裡是客服中心</h1>

      <div className="d-flex">
        <span>
          <Link href="./home">回首頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./user">會員頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./product">商品頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./cart">購物車</Link>
        </span>
      </div>

      <div className="mt-5">
        <h4>會員資料</h4>
        <p className="mt-3">
          使用者ID: <span>{auth.userData.id}</span>
        </p>
        <p>
          使用者姓名: <span>{auth.userData.name}</span>
        </p>
      </div>

      <div className="mt-5 ms-2 w-25">
        <h4 className="mb-3">對話框</h4>

        <div className="message-container">
          <div
            id="messages"
            ref={messagesEndRef}
            className="border p-2"
            style={{ height: '20vh', overflow: 'scroll', width: '100%' }}
          >
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>

          <div className="input-group mt-2" style={{ width: '100%' }}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入訊息"
              className="form-control"
              disabled={!auth.userData.name}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={!auth.userData.name}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customer
