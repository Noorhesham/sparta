// context/CartContext.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    stock: number;
    images: Array<{ secure_url: string }>;
  };
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: CartItem["product"], quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load initial cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = useCallback(
    (product: CartItem["product"], quantity: number) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.product._id === product._id);

        if (existingItem) {
          return currentItems.map((item) =>
            item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }

        return [...currentItems, { product, quantity, price: product.price }];
      });

      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${quantity} ${product.title} إلى سلة التسوق`,
      });
    },
    [toast]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity < 1) {
        return currentItems.filter((item) => item.product._id !== productId);
      }

      return currentItems.map((item) => (item.product._id === productId ? { ...item, quantity } : item));
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product._id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
