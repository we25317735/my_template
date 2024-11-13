import React, { useEffect, useState } from 'react'
import {
  parseJwt,
  getUserByEmail,
  login,
  getUserById,
  getUserByPhone,
  registerUser,
} from '@/services/user'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

/*
  這邊主要帳號密碼部分,
  使用者可以使用 email 或是 電話號碼 進行登入/註冊,
  
  如果該帳號的 email 跟 電話 都有綁定使用者,
  登入時, 可以則一輸入為帳號即可
  
  後端部分可以寫 "異常登入" 來進行處理(但我不會寫)
  
*/

export default function UserLogin() {
  const [inputValue, setInputValue] = useState('') // 帳號輸入(email 或 電話)
  const [password, setPassword] = useState('') // 密碼輸入
  const [disabled_on, setDisabled_on] = useState(true) // 密碼框開關
  const [button_state, setButton_state] = useState('1') // 按鈕有 3 種狀態
  const [verify, setVerify] = useState('') // 驗證碼(純測試)
  const router = useRouter()

  // 依據當前密碼字數, 切換顯示按鈕(設定只在 2, 3 狀態時生效)
  useEffect(() => {
    if (button_state === '3' && password.length >= 3) {
      setButton_state('2') // 密碼字數 >= 3, 切換為 "可以登入"
      // console.log('切換可登入')
    } else if (button_state === '2' && password.length < 3) {
      setButton_state('3') // 密碼字數 < 3, 保持 "忘記密碼"
      // console.log('切換忘記密碼')
    }
  }, [password])

  // 測試用(會顯示亂數驗證碼)
  useEffect(() => {
    console.log('驗證碼: ', verify)
  }, [verify])

  // 1. 帳號先驗證使用者(手機信箱分開, 後續方便寫註冊)
  const user_check = async () => {
    const email_str = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // 信箱格式
    const phone_str = /^[0-9]+$/ // 電話格式

    // 信箱登入處理
    if (email_str.test(inputValue)) {
      const user = await getUserByEmail(inputValue)

      // 搜尋到使用者, 進入輸密碼環節
      if (user.data.status === 'success') {
        const { email, name } = user.data.data
        console.log('使用者: ', name, email)
        setButton_state('3') // 切換到忘記密碼狀態
        setDisabled_on(false) // 開啟密碼輸入框
      }

      // 如果查無信箱, 則進入註冊驗證環節
      if (user.data.status === 'error') {
        register_user()
      }
    }

    // 手機登入處理
    if (phone_str.test(inputValue)) {
      console.log('輸入的是電話號碼:', inputValue)
      const user = await getUserByPhone(inputValue)

      if (user.data.status === 'success') {
        const { email, name } = user.data.data
        console.log('使用者: ', name, email)
        setButton_state('3')
        setDisabled_on(false)
      } else if (user.data.status === 'error') {
        Swal.fire({
          title: '帳號不存在',
          text: '需要註冊嗎？',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '註冊',
          cancelButtonText: '取消',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('前往註冊流程')
          }
        })
      }
    }

    console.log('輸入無效，請輸入有效的 Email 或電話號碼')
  }

  // 2. 可以登入函式
  const login_available = async () => {
    console.log('執行可以登入流程')

    // 傳輸帳號與密碼
    const data = {
      account: inputValue,
      password: password,
    }

    // 後端會打包 token, 執行後跳頁面讓 hook 執行即可
    const res = await login(data)

    if (res.data.status === 'success') {
      // 成功後, 跳轉回首頁
      router.push('http://localhost:3000/home')
    } else {
      console.log('密碼錯誤')
    }
  }

  //3. 忘記密碼函式
  const forgot_password = () => {
    console.log('執行忘記密碼流程')
  }

  // 裡面3種按鈕, 根據狀態調用
  const render_button = () => {
    if (button_state === '1') {
      return (
        <button type="button" className="btn btn-success" onClick={user_check}>
          登入 或 註冊
        </button>
      )
    } else if (button_state === '2') {
      // 登入按鈕
      return (
        <button
          type="button"
          className="btn btn-info"
          onClick={login_available}
        >
          可以登入
        </button>
      )
    } else if (button_state === '3') {
      return (
        <button
          type="button"
          className="btn btn-warning"
          onClick={forgot_password}
        >
          忘記密碼
        </button>
      )
    }
  }

  // 註冊並綁定(sweetalert 製作)
  const register_user = () => {
    // 帳號錯誤, 同時詢問是否註冊
    Swal.fire({
      title: '查無使用者',
      text: `是否以 ${inputValue} 進行註冊？`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '註冊',
      cancelButtonText: '取消',
      allowOutsideClick: false, // 不允許點擊外部關閉對話框
    }).then((result) => {
      if (result.isConfirmed) {
        // 可以將使用者導向註冊頁面或處理註冊邏輯
        console.log('前往註冊流程')

        // 隨機生成6位數驗證碼
        let verify = Math.floor(100000 + Math.random() * 900000)

        // 設定一個期限
        setTimeout(() => {
          verify = '操作已逾時'
        }, 100000)
        console.log('隨機亂數: ', verify)

        // 信箱 驗證碼 處理
        Swal.fire({
          title: '已寄送驗證碼至該 email',
          text: inputValue,
          input: 'text',
          inputPlaceholder: '請輸入驗證碼',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '認證',
          cancelButtonText: '取消',
          allowOutsideClick: false, // 不允許點擊外部關閉對話框
          inputAttributes: {
            style: 'text-align: center; color: blue; box-shadow:none;',
          },
          preConfirm: (e) => {
            console.log('sweetalert 的輸入框', e)
            if (e === verify.toString() && e !== '') {
              console.log('輸入成功')

              // 信箱認證成功, 開始新增帳號
              Swal.fire({
                title: '驗證成功',
                text: `請輸入以下資料`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: '註冊',
                cancelButtonText: '取消',
                allowOutsideClick: false,
                html: `
                  <input type="text" id="name" class="swal2-input" placeholder="請輸入名稱"  maxlength="15" style="text-align: center; color: blue; box-shadow:none;">
                  <input type="password" id="password" class="swal2-input" placeholder="請輸入密碼" maxlength="15" style="text-align: center; color: blue; box-shadow:none;">
                `,
                preConfirm: async () => {
                  const name = document.getElementById('name').value
                  const password = document.getElementById('password').value

                  if (!name || !password) {
                    Swal.showValidationMessage('名稱和密碼不能為空')
                    return
                  }

                  if (password.length < 4) {
                    Swal.showValidationMessage('密碼字數過少')
                    return
                  }

                  const data = {
                    email: inputValue,
                    name,
                    password,
                  }
                  console.log('準備註冊: ', data)

                  // 開始註冊帳號
                  let new_user = await registerUser(data)

                  Swal.fire({
                    title: '帳號註冊成功',
                    text: `請繼續登入操作`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: '繼續',
                    cancelButtonText: '取消',
                    allowOutsideClick: false,
                  })
                },
              })
            } else if (verify === '操作已逾時') {
              Swal.showValidationMessage('操作已逾時, 請重新操作')
              return false // 阻止彈窗關閉
            } else {
              Swal.showValidationMessage('輸入錯誤')
              return false // 阻止彈窗關閉
            }
          },
        })
      }
    })
  }

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="請輸入 Email 或 電話號碼"
          disabled={!disabled_on}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder={disabled_on ? '上方用戶驗證' : '請輸入密碼'}
          disabled={disabled_on}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="d-grid">
        {/* 按鈕狀態顯示 */}
        {render_button()}
      </div>
    </div>
  )
}
