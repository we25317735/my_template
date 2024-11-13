import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import { getMessage, check_conversation, offline } from '@/services/messgae' // 訊息 api
import Link from 'next/link'
import io from 'socket.io-client'

const Customer = () => {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const { auth, setAuth, handleCheckAuth } = useAuth()

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    handleCheckAuth()
  }, [setAuth, router])

  useEffect(() => {
    socketRef.current = io('http://localhost:3005')

    socketRef.current.on('connect', async () => {
      console.log('Socket.io 已連線')

      const userData = {
        user_id: auth.userData.id,
        user_name: auth.userData.name,
      }
      socketRef.current.emit('identify', userData)

      const conversation = await check_conversation(`1/${auth.userData.id}`)
      let conversation_id = conversation.data.conversation_id

      const messages = await getMessage(`/${conversation_id}`)
      const history_msg = messages.data.messages

      const All_Messages = history_msg.map(
        (msg) => `${msg.sender_name}: ${msg.message}`
      )
      setMessages(All_Messages)
    })

    socketRef.current.on('message', async (data) => {
      const { user_name, message } = data

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

    return () => {
      socketRef.current.disconnect()
    }
  }, [auth.userData])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  const sendMessage = async () => {
    if (messageInput.trim() === '') return

    const message = {
      user_id: auth.userData.id,
      user_name: auth.userData.name,
      message: messageInput,
      recipient_id: 1,
    }

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message', message)

      let res = await offline(message)

      setMessages((prevMessages) => [
        ...prevMessages,
        `${message.user_name}: ${message.message}`,
      ])
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
      <h1>客服中心</h1>

      <nav className="nav flex mb-4">
        <Link href="/home" className="nav-link ps-2">
          回首頁
        </Link>
        <Link href="/user" className="nav-link ps-2">
          會員頁
        </Link>
        <Link href="/product" className="nav-link ps-2">
          商品頁
        </Link>
        <Link href="/cart" className="nav-link ps-2">
          購物車
        </Link>
      </nav>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">會員資料</h4>
          <p>使用者ID: {auth.userData.id}</p>
          <p>使用者姓名: {auth.userData.name}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">對話框</h4>
          <div
            id="messages"
            ref={messagesEndRef}
            className="border p-2"
            style={{ height: '20vh', overflowY: 'scroll', width: '100%' }}
          >
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <div className="input-group mt-3" style={{ width: '100%' }}>
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
