import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { SiLine } from 'react-icons/si' // 引入 Line 圖標
import { initUserData, useAuth } from '@/hooks/use-auth'
import { lineLoginRequest } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

const Line_btn = () => {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 處理登入
  const goLineLogin = () => {
    // 判斷是否已經登入，已登入不會再作登入
    if (auth.isAuth) return //如果帳號有東西則不執行
    // console.log('開始執行 line 登入') //讀不到東西

    // 從後端伺服器取得line登入網址
    lineLoginRequest()
  }

  return (
    <>
      <button
        className="btn d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: '#fff',
          color: '#00C300', // Line 的品牌綠色
          padding: '8px',
          border: '1px solid #00C300',
          borderRadius: '10px',
          width: '50px',
          height: '50px',
          fontSize: '24px',
        }}
        onClick={goLineLogin} // line 登入
      >
        <SiLine />
      </button>
      {/* <button onClick={handleLineLogout}>LINE 登出(logout)</button> */}
    </>
  )
}

export default Line_btn
