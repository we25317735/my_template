import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import axiosInstance from '@/services/axios-instance'
import toast, { Toaster } from 'react-hot-toast'

// 目前只有 Line-pay
export default function Finish() {
  const { clearCart } = useCart() // 調用清空購物車
  const { auth, handleCheckAuth } = useAuth() // 調使用者, 清空購物車
  const router = useRouter()

  // 確認交易結果
  const order_handle = async (transactionId) => {
    const res = await axiosInstance.get(
      `/line-pay/confirm?transactionId=${transactionId}`
    )

    if (res.data.status === 'success') {
      let str = `${auth.userData.name}_cart`
      console.log('成功了 成功了', auth.userData.data)
      clearCart(str) // 清空購物車
      toast.success('付款成功')
    } else {
      toast.error('付款失敗')
    }

    // 更新訂單結果
    if (res.data.data) {
      // setResult(res.data.data)
      //   console.log('更新訂單結果: ', res.data.data)
    }
  }

  // 監聽 URL 的變化，處理回調
  useEffect(() => {
    handleCheckAuth()
    if (router.isReady) {
      const { transactionId, orderId } = router.query

      if (transactionId && orderId) {
        order_handle(transactionId)
      }
    }
  }, [router.isReady])

  return (
    <>
      <h1 className="ms-2">恭禧完成結帳</h1>
      <p>
        東西全在 clg 裡面了, 記得丟去資料庫, <br />
        訂單和訂單詳情要分一下, 寫個 timeOut啥的, 不然reload會出現付款失敗
      </p>
      <Link href="../home">回首頁</Link>
      <Toaster />
    </>
  )
}
