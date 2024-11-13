import React, { useEffect } from 'react'
import { FaTwitter } from 'react-icons/fa'
import { Toaster } from 'react-hot-toast'

// 登入按鈕
import Google_btn from './google_btn'
import Line_btn from './line_btn'
import Twitter_btn from './twitter_btn'
import GitHub_btn from './github_btn'
import User_login from './user_login'

const Login = () => {
  return (
    <div
      className="container p-4 mt-5"
      style={{
        maxWidth: '400px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '10px',
      }}
    >
      <h2 className="text-center mb-4">Login</h2>

      <User_login />

      <div className="mb-3 mt-5">
        <p className="text-center">
          —————— <span>其他方式登入</span> ——————
        </p>
        {/* 第三方 登入按鈕 */}
        <div className=" d-flex justify-content-around">
          <Google_btn />
          <Line_btn />
          <Twitter_btn />
          <GitHub_btn />
        </div>
      </div>
      <div className="text-center my-3">or</div>

      {/* 吐司 */}
      <Toaster />
    </div>
  )
}

export default Login
