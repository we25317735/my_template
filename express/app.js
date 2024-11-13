import * as fs from 'fs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import bodyParser from 'body-parser' //被買走的 bodyParser

// 路徑: http://localhost:3005/api

// import google_login from "./routes/google-login.js"

// 使用檔案的session store，存在sessions資料夾
import sessionFileStore from 'session-file-store'
const FileStore = sessionFileStore(session)

// 修正 ESM 中的 __dirname 與 windows os 中的 ESM dynamic import
import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
import { extendLog } from '#utils/tool.js'
import 'colors'
extendLog()

// 建立 Express 應用程式
const app = express()

// cors設定，參數為必要，注意不要只寫`app.use(cors())`
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', // ws 第二個人
      'http://localhost:3002', // ws 管理員
      'https://localhost:9000',
      'http://127.0.0.1:5500/index_2.html',
      'http://http/socket.io/?EIO=4&transport=polling&t=P89LNsS',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// 自訂義 路由導入
// import productRouter from './routes/product.js'
// import articleRouter from './routes/article.js'
// import cartRouter from './routes/cart.js'
// import courseRouter from './routes/course.js'
// import IGotBrewRouter from './routes/IGotBrew.js'
import userRouter from './routes/user.js'
import messagesRouter from './routes/messages.js'
// import loginRouter from './routes/login.js'
// import TestPageRouter from './routes/TestPage.js'
// import searchRouter from './routes/search.js'
// import analRouter from './routes/anal.js'
// app.use('/product', productRouter) //商品 路由
// app.use('/search', searchRouter) // 搜尋 路由
// app.use('/article', articleRouter) // 文章 路由
// app.use('/cart', cartRouter) // 購物車 路由
// app.use('/course', courseRouter) // 課程 路由
// app.use('/IGotBrew', IGotBrewRouter) // 首頁 路由
// app.use('/login', loginRouter) // 登入介面 路由
app.use('/user', userRouter) // 使用者介面 路由
app.use('/messages', messagesRouter) // 使用者介面 路由
// app.use('/anal', analRouter) // 圖表 路由
// app.use('/TestPage', TestPageRouter) // 測試路由(參考)

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())

// 視圖引擎設定
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// 記錄HTTP要求
app.use(logger('dev'))
// 剖析 POST 與 PUT 要求的JSON格式資料
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 剖折 Cookie 標頭與增加至 req.cookies
app.use(cookieParser())
// 在 public 的目錄，提供影像、CSS 等靜態檔案
app.use(express.static(path.join(__dirname, 'public')))

// fileStore的選項 session-cookie使用
const fileStoreOptions = { logFn: function () {} }
app.use(
  session({
    store: new FileStore(fileStoreOptions), // 使用檔案記錄session
    name: 'SESSION_ID', // cookie名稱，儲存在瀏覽器裡
    secret: '67f71af4602195de2450faeb6f8856c0', // 安全字串，應用一個高安全字串
    cookie: {
      maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session保存30天
    },
    resave: false,
    saveUninitialized: false,
  })
)

// 載入routes中的各路由檔案，並套用api路由 START
const apiPath = '/api' // 預設路由
const routePath = path.join(__dirname, 'routes') //改資料夾
const filenames = await fs.promises.readdir(routePath)

for (const filename of filenames) {
  const item = await import(pathToFileURL(path.join(routePath, filename)))
  const slug = filename.split('.')[0]
  app.use(`${apiPath}/${slug === 'index' ? '' : slug}`, item.default)
}
// 載入routes中的各路由檔案，並套用api路由 END

// 捕抓404錯誤處理
app.use(function (req, res, next) {
  // next(createError(404))
  res.send('沒有東西 404')
})

// 錯誤處理函式
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // 更改為錯誤訊息預設為JSON格式
  res.status(500).send({ error: err })
})

export default app
