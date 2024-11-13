import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa' // 這裡使用 Visa 和 Mastercard 作為示例，因為 ECPay 的圖標可能不在 react-icons 中

//
import Line_pay from './line_pay'

export default function Cart() {
  const { auth, handleCheckAuth } = useAuth()
  const { cart, clearCart } = useCart()

  useEffect(() => {
    handleCheckAuth()
    // 如果未登入，清空購物車
    if (!auth.isAuth) {
      clearCart()
    }
  }, [auth.isAuth]) // 當 auth.isAuth 改變時觸發

  // 結帳按鈕
  const handleCheckout = () => {
    console.log('結帳', cart)
    clearCart()
  }

  return (
    <>
      <h1>這裡是購物車</h1>
      <div className="d-flex">
        <span>
          <Link href="./home">回首頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./user">會員頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./product">商品頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./customer">客服中心</Link>
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

      {/* 購物車內容 */}
      <div className="mt-5">
        <h4>購物車</h4>
        {cart.items.length > 0 ? (
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} = $
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>購物車是空的。</p>
        )}
        <p>總金額: ${cart.cartTotal}</p>
      </div>

      {/* 付款方式 */}
      <div className="mt-5">
        <h5>付款方式</h5>
        <div className="d-flex gap-2">
          <Line_pay />

          {/* <button
            className="btn d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#fff',
              color: '#000', // 根據品牌顏色進行修改
              padding: '8px',
              border: '1px solid #000', // 根據品牌顏色進行修改
              borderRadius: '10px',
              width: '50px',
              height: '50px',
              fontSize: '24px',
            }}
            onClick={() => console.log('ECPay')}
          >
            <FaCcVisa />
          </button> */}
        </div>
      </div>

      <button
        className="btn btn-primary mt-5"
        onClick={handleCheckout}
        disabled={!auth.isAuth} // 未登入時禁用結帳按鈕
      >
        結帳(現在是清空)
      </button>
    </>
  )
}
