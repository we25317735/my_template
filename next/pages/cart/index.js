import React, { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa' // 這裡使用 Visa 和 Mastercard 作為示例

// 假設 Line_pay 是你自定義的 Line Pay 付款按鈕
import Line_pay from './line_pay'

export default function Cart() {
  const { auth, handleCheckAuth } = useAuth()
  const { cart, clearCart } = useCart()

  useEffect(() => {
    handleCheckAuth()
    if (!auth.isAuth) {
      clearCart()
    }
  }, [auth.isAuth])

  // 結帳按鈕
  const handleCheckout = () => {
    console.log('結帳', cart)
    clearCart()
  }

  return (
    <div className="container mt-5">
      <h1>購物車</h1>

      {/* 導覽連結 */}
      <nav className="nav flex mb-4">
        <Link href="/home" className="nav-link ps-2">
          回首頁
        </Link>
        <Link href="/user" className="nav-link ps-2">
          會員頁
        </Link>
        <Link href="/product" className="nav-link ps-2">
          商品頁
        </Link>
        <Link href="/customer" className="nav-link ps-2">
          客服中心
        </Link>
      </nav>

      {/* 會員資料 */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">會員資料</h4>
          <p>使用者ID: {auth.userData.id}</p>
          <p>使用者姓名: {auth.userData.name}</p>
        </div>
      </div>

      {/* 購物車內容 */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">購物車內容</h4>
          {cart.items.length > 0 ? (
            <ul className="list-group">
              {cart.items.map((item) => (
                <li key={item.id} className="list-group-item">
                  {item.name} - ${item.price} x {item.quantity} = $
                  {item.price * item.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">購物車是空的。</p>
          )}
          <p className="mt-3">總金額: ${cart.cartTotal}</p>
        </div>
      </div>

      {/* 付款方式 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">付款方式</h5>
          <div className="d-flex gap-3">
            <Line_pay />
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#fff',
                color: '#000',
                border: '1px solid #000',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '24px',
              }}
              onClick={() => console.log('ECPay')}
            >
              <FaCcVisa />
            </button>
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#fff',
                color: '#000',
                border: '1px solid #000',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '24px',
              }}
              onClick={() => console.log('ECPay')}
            >
              <FaCcMastercard />
            </button>
          </div>
        </div>
      </div>

      {/* 結帳按鈕 */}
      {/* <button
        className="btn btn-primary mt-4"
        onClick={handleCheckout}
        disabled={!auth.isAuth}
      >
        結帳(現在是清空)
      </button> */}
    </div>
  )
}
