import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { FaGoogle, FaLine, FaTwitter } from 'react-icons/fa'
import { Line_bind, lineBindCallback } from '@/services/bind'
import toast, { Toaster } from 'react-hot-toast'
import Google_bind from './google_bind'

export default function User() {
  const { auth, setAuth, handleCheckAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    handleCheckAuth() // 調用 handleCheckAuth 抓取 auth 資料
  }, [setAuth])

  // LINE 登入後的回調處理
  useEffect(() => {
    if (router.isReady && auth.isAuth) {
      if (!router.query.code) return // 沒有 code 表示非登入狀態
      console.log('使用者: ', auth.userData.name)
      callbackLineLogin(router.query) // 處理 LINE 登入回調
    }
  }, [router.isReady, router.query])

  // 處理 LINE 登入後的回調，從 LINE 回應中解析資料並更新狀態
  const callbackLineLogin = async (query) => {
    const res = await lineBindCallback(query, auth.userData)

    if (!res) {
      toast.error('LINE 回傳失敗, 請稍後再試')
    }

    if (res.data.status === 'success') {
      setAuth((prevAuth) => ({
        ...prevAuth,
        userData: {
          ...prevAuth.userData,
          line_uid: res.data.line_uid,
        },
      }))
      toast.success('LINE 帳號綁定成功')
    } else {
      toast.error('LINE 帳號綁定失敗')
    }
  }

  // LINE 帳號綁定按鈕處理
  const LineBind_btn = () => {
    Line_bind()
  }

  return (
    <div className="container mt-5">
      <h1>會員頁</h1>

      {/* 導覽連結 */}
      <nav className="nav flex mb-4">
        <Link href="/home" className="nav-link ps-2 mb-2">
          首頁
        </Link>
        <Link href="/product" className="nav-link ps-2 mb-2">
          商品頁
        </Link>
        <Link href="/cart" className="nav-link ps-2 mb-2">
          購物車
        </Link>
        <Link href="/customer" className="nav-link ps-2 mb-2">
          客服中心
        </Link>
      </nav>

      {/* 會員資料 */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">會員資料</h4>
          <p className="card-text">
            使用者ID: <span>{auth?.userData?.id || '(使用者未登入)'}</span>
          </p>
          <p className="card-text">
            使用者姓名: <span>{auth?.userData?.name || '(使用者未登入)'}</span>
          </p>
        </div>
      </div>

      {/* 帳號綁定 */}
      {auth.userData.id && (
        <div className="d-sm-flex">
          <div className="card w-50 mb-4 me-sm-2">
            <div className="card-body">
              <h4 className="card-title">帳號綁定</h4>
              <ul className="list-group list-group-flush">
                {/* Google 綁定 */}
                <li className="list-group-item d-flex align-items-center">
                  <FaGoogle style={{ color: '#DB4437', marginRight: '10px' }} />
                  <span className="me-auto">Google</span>
                  {auth.userData.google_uid ? (
                    <button className="btn btn-sm btn-success">連結中</button>
                  ) : (
                    <Google_bind />
                  )}
                </li>

                {/* LINE 綁定 */}
                <li className="list-group-item d-flex align-items-center">
                  <FaLine style={{ color: '#00C300', marginRight: '10px' }} />
                  <span className="me-auto">LINE</span>
                  {auth.userData.line_uid ? (
                    <button className="btn btn-sm btn-success">連結中</button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={LineBind_btn}
                    >
                      未連接
                    </button>
                  )}
                </li>

                {/* twitter 綁定 */}
                <li className="list-group-item d-flex align-items-center">
                  <FaTwitter
                    style={{ color: '#1DA1F2', marginRight: '10px' }}
                  />
                  <span className="me-auto">LINE</span>
                  {auth.userData.line_uid ? (
                    <button className="btn btn-sm btn-success">
                      開通需要現金
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={LineBind_btn}
                    >
                      未連接
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/*  */}
          <div className="card w-50 mb-4 ms-sm-2">
            <div className="card-body">
              <h4 className="card-title">未開發</h4>
              <ul className="list-group list-group-flush"></ul>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
