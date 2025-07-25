import { type Dish, type Topping } from '../services/api';

export interface CartItemData {
  dish: Dish;
  quantity: number;
  selectedToppings: Topping[];
}

const CART_STORAGE_KEY = 'dish-order-cart';

export const saveCartToStorage = (cartItems: CartItemData[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (): CartItemData[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};