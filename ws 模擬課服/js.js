const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', function(socket) {
    console.log('用戶已連線');

    // 接收來自客戶端的訊息
    socket.on('message', function(message) {
        // console.log('收到訊息：', message.toString());

        // 廣播訊息給所有已連線的客戶端
        server.clients.forEach(function(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // 連線關閉時
    socket.on('close', function() {
        console.log('用戶已斷線');
    });

    // 發生錯誤時
    socket.on('error', function(error) {
        console.error('WebSocket 發生錯誤', error);
    });
});

console.log('WebSocket 伺服器已啟動在 ws://localhost:8080');
