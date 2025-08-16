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

const mockDishes: Dish[] = [
  {
    id: 1,
    dishData: {
      name: "김치찌개",
      description: "맛있는 김치찌개입니다",
      image: "/images/home.png",
      ingredients: [
        { name: "김치", from: "한국" },
        { name: "돼지고기", from: "한국" }
      ],
      price: 8000,
      toppings: [
        { name: "치즈", price: 1000 },
        { name: "라면사리", price: 1500 }
      ],
      tag: [{ hot: true, new: false, picked: true }],
      type: "찌개"
    }
  },
  {
    id: 2,
    dishData: {
      name: "불고기",
      description: "달콤한 불고기",
      image: "/images/home.png",
      ingredients: [
        { name: "소고기", from: "한국" }
      ],
      price: 15000,
      toppings: [
        { name: "버섯", price: 2000 }
      ],
      tag: [{ hot: false, new: true, picked: false }],
      type: "고기"
    }
  },
  {
    id: 3,
    dishData: {
      name: "된장찌개",
      description: "구수한 된장찌개",
      image: "/images/home.png",
      ingredients: [
        { name: "된장", from: "한국" },
        { name: "두부", from: "한국" }
      ],
      price: 7000,
      toppings: [
        { name: "청양고추", price: 500 }
      ],
      tag: [{ hot: false, new: false, picked: false }],
      type: "찌개"
    }
  }
];

export const dishService = {
  async getDishes(): Promise<{ data: Dish[], isUsingMockData: boolean }> {
    try {
      const response = await api.get<Dish[]>('/dish');
      return { data: response.data, isUsingMockData: false };
    } catch (error) {
      console.warn('API 연결 실패, 목데이터를 사용합니다:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockDishes, isUsingMockData: true };
    }
  },

  async createDish(dishData: DishData): Promise<Dish> {
    try {
      const response = await api.post<Dish>('/dish', dishData);
      return response.data;
    } catch (error) {
      console.warn('API 연결 실패, 로컬에서 시뮬레이션합니다:', error);
      const newId = Math.max(...mockDishes.map(d => d.id), 0) + 1;
      const newDish: Dish = { id: newId, dishData };
      mockDishes.push(newDish);
      await new Promise(resolve => setTimeout(resolve, 500));
      return newDish;
    }
  },

  async updateDish(id: number, dishData: DishData): Promise<Dish> {
    try {
      const response = await api.put<Dish>(`/dish/${id}`, dishData);
      return response.data;
    } catch (error) {
      console.warn('API 연결 실패, 로컬에서 시뮬레이션합니다:', error);
      const dishIndex = mockDishes.findIndex(d => d.id === id);
      if (dishIndex !== -1) {
        mockDishes[dishIndex] = { id, dishData };
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, dishData };
    }
  },

  async deleteDish(id: number): Promise<void> {
    try {
      await api.delete(`/dish/${id}`);
    } catch (error) {
      console.warn('API 연결 실패, 로컬에서 시뮬레이션합니다:', error);
      const dishIndex = mockDishes.findIndex(d => d.id === id);
      if (dishIndex !== -1) {
        mockDishes.splice(dishIndex, 1);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  },

  async uploadImage(file: File): Promise<{ data: { imagePath: string }, isUsingMockData: boolean }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post<{ imagePath: string }>('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { data: response.data, isUsingMockData: false };
    } catch (error) {
      console.warn('이미지 업로드 API 연결 실패, 로컬에서 시뮬레이션합니다:', error);
      
      // 목데이터 모드에서는 파일을 base64로 변환하여 로컬 스토리지에 저장
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const mockImagePath = `/images/mock_${Date.now()}_${file.name}`;
          
          // 로컬 스토리지에 이미지 데이터 저장 (실제 프로덕션에서는 사용하지 않음)
          localStorage.setItem(mockImagePath, base64);
          
          setTimeout(() => {
            resolve({ 
              data: { imagePath: mockImagePath }, 
              isUsingMockData: true 
            });
          }, 500);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  async orderDishes(orderItems: OrderItem[]): Promise<void> {
    await api.post('/dish/order', orderItems);
  }
};

export default api;