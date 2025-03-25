import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType {
  cart: (CartItem & { quantity: number })[]; // Add quantity to CartItem
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<(CartItem & { quantity: number })[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId); // Check by title

      if (existingItem) {
        // Increment quantity and update subtotal
        return prevCart.map((c) =>
          c.bookId === item.bookId
            ? { ...c, quantity: c.quantity + 1 } // Increment quantity
            : c
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId === bookId));
  };

  const clearCart = () => {
    setCart(() => []);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
