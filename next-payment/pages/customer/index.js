import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const Customer = () => {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const username = '一號老鐵'
  const socketRef = useRef(null) // 使用 useRef 來保存 WebSocket 連線

  useEffect(() => {
    // 建立 WebSocket 連線
    socketRef.current = new WebSocket('ws://localhost:3005')

    // 連線開啟時
    socketRef.current.onopen = () => {
      console.log('WebSocket 已連線')
    }

    // 接收來自伺服器的訊息
    socketRef.current.onmessage = (event) => {
      console.log(event.data)
      setMessages((prevMessages) => [...prevMessages, event.data])
    }

    // 當連線關閉時
    socketRef.current.onclose = () => {
      console.log('WebSocket 已斷線')
    }

    // 當發生錯誤時
    socketRef.current.onerror = (event) => {
      console.error('WebSocket 發生錯誤', event)
    }

    // 組件卸載時關閉 WebSocket 連線
    return () => {
      socketRef.current.close()
    }
  }, [])

  const sendMessage = () => {
    if (messageInput.trim() === '') return
    const message = `${username}: ${messageInput}`

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message)
      setMessageInput('')
    } else {
      console.error('WebSocket 連線尚未開啟或已斷線')
    }
  }

  const Key_down = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div>
      <h1>這裡是課服中心</h1>

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
      </div>

      <div className="mt-5">
        <h4 className="mb-3">對話框</h4>

        <div id="messages" style={{ height: '20vh', overflow: 'scroll' }}>
          {messages
            .slice(0)
            .reverse()
            .map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
        </div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={Key_down}
          placeholder="輸入訊息"
        />
        <button onClick={sendMessage}>發送</button>
      </div>
    </div>
  )
}

export default Customer
