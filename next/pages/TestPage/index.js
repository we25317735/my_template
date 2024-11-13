import { useEffect, useState } from 'react'
import { getMessage } from '@/services/messgae'

export default function TestPage() {
  // 不需要 async
  useEffect(() => {
    const getData = async () => {
      let str = '2' // 這到時候放 auth.userData.id
      const res = await getMessage(`1/${str}`) //調資料, 管理員和誰的對話

      let dialogue = res.data.messages.map((e) => {
        return e.message
      })
      console.log('收到: ', dialogue)
    }

    getData()
  }, [])

  return (
    <>
      <h1>jiop</h1>
    </>
  )
}
