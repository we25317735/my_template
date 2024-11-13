import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// 載入認証用context
import { AuthProvider } from '@/hooks/use-auth'

// 載入購物車context
import { CartProvider } from '@/hooks/use-cart'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap')
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  )
}
