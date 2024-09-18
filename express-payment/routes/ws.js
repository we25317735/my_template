import WebSocket from 'ws'

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', function (socket) {
    console.log('用戶已連線')

    socket.on('message', function (message) {
      // 廣播訊息給所有已連線的客戶端
      wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString())
        }
      })
    })

    socket.on('close', function () {
      console.log('用戶已斷線')
    })

    socket.on('error', function (error) {
      console.error('WebSocket 發生錯誤', error)
    })
  })
}

export default setupWebSocket
