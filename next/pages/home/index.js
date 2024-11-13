import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useFirebase from '@/hooks/use-firebase'
import { logout, lineLogout } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { initUserData } from '@/hooks/use-auth'

const Home = () => {
  const { auth, setAuth, handleCheckAuth } = useAuth()
  const { logoutFirebase } = useFirebase() // 處理 Firebase 登出
  const router = useRouter()

  // 初次渲染後檢查會員是否已登入
  useEffect(() => {
    handleCheckAuth() // 呼叫驗證狀態檢查函數
  }, [setAuth, router])

  // 各種登出處理
  const handleLogout = async () => {
    logoutFirebase() // 1. 執行 Firebase 的登出

    const res = await logout()

    if (res.data.status === 'success') {
      // 3. 如果會員是透過 LINE 登入，執行 LINE 登出
      if (auth.userData.line_uid) {
        const lineLogoutRes = await lineLogout(auth.userData.line_uid)
        if (lineLogoutRes.data.status === 'success') {
          toast.success('LINE 登出成功')
        } else {
          toast.error('LINE 登出失敗')
          return
        }
      }

      toast.success('已成功登出')

      // 4. 重置會員認證狀態
      setAuth({
        isAuth: false,
        userData: initUserData,
      })

      // 5. 跳轉至登入頁面
      router.push('/login')
    } else {
      toast.error('Google 登出失敗')
    }
  }

  // 跳轉登入介面
  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">首頁</h1>

      {/* 導覽連結 */}
      <nav className="nav flex mb-4">
        <Link href="/user" className="nav-link ps-2 mb-2">
          會員頁
        </Link>
        <Link href="/product" className="nav-link ps-2 mb-2">
          商品頁
        </Link>
        <Link href="/cart" className="nav-link p2-2 mb-2">
          購物車
        </Link>
        <Link href="/customer" className="nav-link p-s2 mb-2">
          客服中心
        </Link>
      </nav>

      {/* 登入/登出按鈕與會員狀態 */}
      <div className="mb-3">
        {auth.isAuth ? (
          <button onClick={handleLogout} className="btn btn-danger">
            登出
          </button>
        ) : (
          <button onClick={handleLogin} className="btn btn-primary">
            登入
          </button>
        )}
      </div>
      <p className="text-muted mb-4">
        會員狀態: {auth.isAuth ? '已登入' : '未登入'}
      </p>

      {/* 會員資料 */}
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">會員資料</h4>
          <p className="card-text">
            使用者ID: {auth.userData.id || '(使用者未登入)'}
          </p>
          <p className="card-text">
            使用者姓名: {auth.userData.name || '(使用者未登入)'}
          </p>
        </div>
      </div>

      {/* Toast 通知 */}
      <Toaster />
    </div>
  )
}

export default Home
