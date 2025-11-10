import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add item or update quantity if it exists
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, qty: i.qty + item.qty, total: (i.qty + item.qty) * i.price }
            : i
        );
      }
      return [...prev, { ...item }];
    });
  };

  // ✅ Increase quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price } : i
      )
    );
  };

  // ✅ Decrease quantity
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.qty > 1
            ? { ...i, qty: i.qty - 1, total: (i.qty - 1) * i.price }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // ✅ Delete item
  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQty, decreaseQty, deleteItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
