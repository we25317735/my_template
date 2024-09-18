import React, { useEffect } from 'react'
import { FaTwitter } from 'react-icons/fa'
import { Toaster } from 'react-hot-toast'

// 登入按鈕
import Google_btn from './google_btn'
import Line_btn from './line_btn'

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
      <div className="mb-3 d-flex justify-content-around">
        {/* Google 登入按鈕 */}
        <Google_btn />
        <Line_btn />
        {/* <button
          className="btn d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: '#fff',
            color: '#1da1f2',
            padding: '8px',
            border: '1px solid #1da1f2',
            borderRadius: '10px',
            width: '50px',
            height: '50px',
            fontSize: '24px',
          }}
        >
          <FaTwitter />
        </button> */}
      </div>
      <div className="text-center my-3">or</div>
      <form>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-secondary">
            Login
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  )
}

export default Login
