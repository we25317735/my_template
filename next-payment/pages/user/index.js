import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { checkAuth, getFavs } from '@/services/user'

export default function user() {
  const { auth, setAuth, handleCheckAuth } = useAuth()

  useEffect(() => {
    handleCheckAuth() // 這裡調用 handleCheckAuth 抓取 auth 資料
  }, [setAuth])

  return (
    <>
      <h1>這裡是會員頁</h1>
      <div className="d-flex">
        <span>
          <Link href="./home">回首頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./product">商品頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./cart">購物車</Link>
        </span>
        <span className="ms-3">
          <Link href="./customer">課服中心</Link>
        </span>
      </div>

      <div className="mt-5">
        <h4>會員資料</h4>
        <p className="mt-3">
          使用者ID: <span>{auth.userData.id}</span>
        </p>
        <p>
          使用者姓名: <span>{auth.userData.name}</span>
        </p>
      </div>
    </>
  )
}
