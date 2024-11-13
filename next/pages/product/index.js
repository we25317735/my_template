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

  // 檢查會員資料, 如果未登入，清空購物車
  useEffect(() => {
    handleCheckAuth()

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
    <div className="container mt-5">
      <h1>商品頁</h1>

      {/* 導覽連結 */}
      <nav className="nav flex mb-4">
        <Link href="/home" className="nav-link ps-2 mb-2">
          首頁
        </Link>
        <Link href="/user" className="nav-link ps-2 mb-2">
          會員頁
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
          <p className="card-text mt-3">使用者ID: {auth.userData.id}</p>
          <p>使用者姓名: {auth.userData.name}</p>
        </div>
      </div>

      {/* 商品選購 */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">商品列表</h4>
          <ul className="list-group mt-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="list-group-item d-flex align-items-center"
              >
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
                <span className="ms-2">{product.name}</span>
                <span className="ms-auto">價格: ${product.price}</span>

                {auth.isAuth &&
                  cart.items.some((item) => item.id === product.id) && (
                    <div className="d-flex align-items-center ms-3">
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
                        已加入購物車
                      </span>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
