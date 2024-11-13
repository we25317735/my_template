import React, { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

/* 
    處理初始登入狀態的地方
    (拿 ben 老師上課的東西來修改)
*/

// 建立一個名為 AuthContext 的上下文（context）
export const AuthContext = createContext(null)

// 建立 AuthProvider 元件，作為提供認證相關狀態和功能的容器
export const AuthProvider2 = ({ children }) => {
  const router = useRouter()
  const [token, setToken] = useState(undefined)
  const [user, setUser] = useState(undefined) // 使用者資訊

  //   useEffect(() => {
  //     if (token) {
  //       // 檢查 token 是否有效
  //       // console.log('我的亂碼:', token)
  //       let result = jwt.decode(token)
  //       console.log('我的 result ', result)
  //       if (result.account) {
  //         // console.log("有效", result);
  //         // 如果 token 有效，設置使用者資訊
  //         setUser(result)
  //         // console.log("數據 ", user);
  //       } else {
  //         // console.log("無效 ",result);
  //         setUser(undefined)
  //       }
  //     }
  //   }, [token])

  // 拿原有的token去更換新的token (似乎也沒在運作就是了)
  useEffect(() => {
    const oldToken = localStorage.getItem('TheToken') // 從 localStorage 中取得舊的 token

    // console.log('舊的 token ', oldToken)
    ;(async () => {
      if (oldToken) {
        let newToken, error
        const url = 'http://localhost:3005/api/user/status'

        // 透過 API 驗證舊的 token 並獲取新的 token
        newToken = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${oldToken}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 'success') {
              // console.log('新的 token ', result.token)
              return result.token // 返回一個新的 token
            } else {
              throw new Error(result.message)
            }
          })
          .catch((err) => {
            error = err
            console.log('token解構錯誤: ', err)
            return undefined
          })

        // 取得 token 後的操作

        if (error) {
          alert(error.message)
          return
        }
        if (newToken) {
          // 如果獲取到新的 token，更新狀態並存入 localStorage
          localStorage.setItem('nextToken', newToken)
          setToken(newToken)
        }
      }
    })()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
