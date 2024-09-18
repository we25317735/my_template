import React, { useState, useEffect, useRef } from 'react'

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div>
      <h1>WebSocket 範例</h1>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="輸入訊息"
      />
      <button onClick={sendMessage}>發送</button>
      <div id="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  )
}

export default Customer
