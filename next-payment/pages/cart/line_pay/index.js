import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { useAuth } from '@/hooks/use-auth'
import { SiLine } from 'react-icons/si'
import toast, { Toaster } from 'react-hot-toast'

export default function Line_pay() {
  const router = useRouter()
  const { auth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState(null) // 確保有訂單資料用來導向 LINE Pay

  // 從 localStorage 獲取購物車資料並建立訂單
  const createOrder = async () => {
    setIsLoading(true)

    const cartData = localStorage.getItem(`${auth.userData.name}_cart`)

    if (!cartData) {
      toast.error('無法取得購物車資料')
      setIsLoading(false)
      return
    }

    const cart = JSON.parse(cartData)
    const products = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    // 建立訂單
    const res = await axiosInstance.post('/line-pay/create-order', {
      amount: products.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
      products: products,
    })

    if (res.data.status === 'success') {
      setOrder(res.data.data.order)
      toast.success('訂單建立成功，準備導向 LINE Pay 付款')
      // 確認要導向至 LINE Pay 進行付款
      if (window.confirm('確認要導向至 LINE Pay 進行付款?')) {
        window.location.href = `http://localhost:3005/api/line-pay/reserve?orderId=${res.data.data.order.orderId}`
      }
    } else {
      toast.error('訂單建立失敗')
    }

    setIsLoading(false)
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
        onClick={createOrder}
        disabled={isLoading}
      >
        <SiLine />
      </button>

      {isLoading && <p>處理中...</p>}

      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
