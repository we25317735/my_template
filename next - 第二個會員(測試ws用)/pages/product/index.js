import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'

export default function Product() {
  const { auth, handleCheckAuth } = useAuth()
  const { cart, addItem, removeItem, updateItemQty, clearCart } = useCart()
  const [products] = useState([
    { id: 1, name: '商品一號', price: 100 },
    { id: 2, name: '商品二號', price: 200 },
    { id: 3, name: '商品三號', price: 20 },
  ])

  useEffect(() => {
    handleCheckAuth()

    // 如果未登入，清空購物車
    if (!auth.isAuth) {
      clearCart()
    }
  }, [auth.isAuth]) // 當 auth.isAuth 改變時觸發

  const Quantity_change = (product, quantity) => {
    if (quantity <= 0) {
      removeItem(product.id)
    } else {
      const updatedProduct = { ...product, quantity }
      if (!cart.items.some((item) => item.id === product.id)) {
        addItem(updatedProduct)
      } else {
        updateItemQty(product.id, quantity)
      }
    }
  }

  return (
    <>
      <h1>這裡是商品頁</h1>
      <div className="d-flex">
        <span>
          <Link href="./home">回首頁</Link>
        </span>
        <span className="ms-3">
          <Link href="./user">會員頁</Link>
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

      <div className="mt-5">
        <h4>商品選購</h4>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <input
                type="checkbox"
                checked={
                  auth.isAuth &&
                  cart.items.some((item) => item.id === product.id)
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    Quantity_change(product, 1)
                  } else {
                    Quantity_change(product, 0)
                  }
                }}
                disabled={!auth.isAuth} // 未登入時禁用 checkbox
              />
              {product.name} - ${product.price}
              {auth.isAuth &&
                cart.items.some((item) => item.id === product.id) && (
                  <>
                    <input
                      type="number"
                      min="1"
                      value={
                        cart.items.find((item) => item.id === product.id)
                          ?.quantity || 1
                      }
                      onChange={(e) =>
                        Quantity_change(product, parseInt(e.target.value, 10))
                      }
                      style={{ marginLeft: '10px', width: '60px' }}
                      disabled={!auth.isAuth} // 未登入時禁用數量輸入框
                    />
                    <span style={{ color: 'green', marginLeft: '10px' }}>
                      購物車
                    </span>
                  </>
                )}
            </li>
          ))}
        </ul>
      </div>

      {/* 這邊可以參考到購物車的變化 */}
      {/* <div className="mt-5">
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
        <button
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={!auth.isAuth} // 未登入時禁用結帳按鈕
        >
          結帳
        </button>
      </div> */}
    </>
  )
}
