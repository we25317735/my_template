import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '@/hooks/use-auth'

const initItems = []

const initState = {
  items: initItems,
  isEmpty: true,
  totalItems: 0,
  cartTotal: 0,
}

// 尋找指定 id 的項目
const findOneById = (items, id) => {
  return items.find((item) => String(item.id) === String(id)) || {}
}

// 更新指定 id 的項目
const updateOne = (items, updateItem) => {
  return items.map((item) => {
    if (String(item.id) === String(updateItem.id)) return updateItem
    else return item
  })
}

// 將新項目加入 items 中，如果已存在則增加數量
const addOne = (items, newItem) => {
  const foundIndex = items.findIndex(
    (item) => String(item.id) === String(newItem.id)
  )

  if (foundIndex > -1) {
    const item = items[foundIndex]
    const newQuantity = item.quantity + newItem.quantity
    return updateOne(items, { ...item, quantity: newQuantity })
  }

  return [...items, newItem]
}

// 移除指定 id 的項目
const removeOne = (items, id) => {
  return items.filter((item) => String(item.id) !== String(id))
}

// 計算每項目的小計
const subtotalPrice = (items) =>
  items.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }))

// 計算整體總價
const totalPrice = (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0)

// 計算整體項目數量
const totalItems = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

// 根據 items 計算 cartState
const generateCartState = (state, items) => {
  const isEmpty = items.length === 0

  return {
    ...initState,
    ...state,
    items: subtotalPrice(items),
    totalItems: totalItems(items),
    cartTotal: totalPrice(items),
    isEmpty,
  }
}

// 初始化
const init = (items) => {
  return generateCartState({}, items)
}

const CartContext = createContext(null)

export const CartProvider = ({ children, initialCartItems = [] }) => {
  const { auth } = useAuth()
  const [cartItems, setCartItems] = useState(initItems)
  const [cartState, setCartState] = useState(init(initialCartItems))
  const userCartKey = auth.userData.name ? `${auth.userData.name}_cart` : null

  // 當 auth.userData.name 存在時，從 localStorage 中讀取購物車數據
  useEffect(() => {
    if (auth.userData.name && userCartKey) {
      const storedCart = localStorage.getItem(userCartKey)
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    }
  }, [auth.userData.name, userCartKey])

  useEffect(() => {
    setCartState(generateCartState(cartState, cartItems))
  }, [cartItems])

  useEffect(() => {
    if (cartItems.length > 0 && userCartKey) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(userCartKey, JSON.stringify(cartItems))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [cartItems, userCartKey])

  const addItem = (item) => {
    setCartItems(addOne(cartItems, item))
  }

  const removeItem = (id) => {
    setCartItems(removeOne(cartItems, id))
  }

  const updateItemQty = (id, quantity) => {
    const item = findOneById(cartItems, id)
    if (!item.id) return
    const updatedItem = { ...item, quantity }
    setCartItems(updateOne(cartItems, updatedItem))
  }

  // const clearCart = () => {
  //   setCartItems([])
  // }
  const clearCart = (e) => {
    console.log('userCartKey:', userCartKey)
    setCartItems([]) // 清空購物車
    if (userCartKey) {
      localStorage.removeItem(userCartKey) // 同時從 localStorage 中移除數據
    }
  }

  const isInCart = (id) => {
    return cartItems.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        items: cartState.items,
        addItem,
        removeItem,
        updateItemQty,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
