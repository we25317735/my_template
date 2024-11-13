import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { SiLine } from 'react-icons/si' // 引入 Line 圖標
import { initUserData, useAuth } from '@/hooks/use-auth'
import { lineLoginRequest } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import {
  logout,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'

const Line_btn = () => {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // LINE 登入後的回調處理
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.code) return // 沒有 code 表示非登入狀態
      callbackLineLogin(router.query) // 處理 LINE 登入回調
    }
  }, [router.isReady, router.query])

  // 處理 LINE 登入後的回調，從 LINE 回應中解析資料並更新狀態
  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)

    if (res.data.status === 'success') {
      // 從 JWT 解析會員資料
      const jwtUser = parseJwt(res.data.data.accessToken)
      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        // 將資料表中的會員資料與 initUserData 中的屬性值進行對應
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 更新全域的會員狀態
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('LINE 登入成功')
        router.push('../home')
      } else {
        toast.error('登入後無法取得會員資料')
      }
    } else {
      toast.error('LINE 登入失敗或已是登入狀態')
    }
  }

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
