/**
 * Module dependencies.
 */
import app from '../app.js'
import debugLib from 'debug'
import http from 'http'
import { exit } from 'node:process'
import 'dotenv/config.js'

const debug = debugLib('node-express-es6:server')

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '6005')
app.set('port', port)

/**
 * Create HTTP server.
 */
var server = http.createServer(app)

/**
 * 手動載入並啟動 WebSocket 伺服器
 * 將 WebSocket 與 HTTP 伺服器整合
 */
import setupWebSocket from '../routes/ws.js'
setupWebSocket(server) // 呼叫 ws.js 中的函式，將 HTTP 伺服器傳入

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) return val
  if (port >= 0) return port
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') throw error

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
