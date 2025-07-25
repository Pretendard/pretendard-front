import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

export interface Ingredient {
  name: string;
  from: string;
}

export interface Topping {
  name: string;
  price: number;
}

export interface Tag {
  hot: boolean;
  new: boolean;
  picked: boolean;
}

export interface DishData {
  name: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  price: number;
  toppings: Topping[];
  tag: Tag[];
  type: string;
}

export interface Dish {
  id: number;
  dishData: DishData;
}

export interface OrderItem {
  name: string;
  toppings: Topping[];
}

export const dishService = {
  async getDishes(): Promise<Dish[]> {
    const response = await api.get<Dish[]>('/dish');
    return response.data;
  },

  async orderDishes(orderItems: OrderItem[]): Promise<void> {
    await api.post('/dish/order', orderItems);
  }
};

export default api;