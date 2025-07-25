import { useState, useEffect } from 'react';
import { dishService, type Dish } from '../../services/api';
import MenuPreview from '../../components/ui/menu_preview/menu_preview';
import styles from './dish-list.module.css';

interface DishListProps {
  onDishSelect?: (dish: Dish) => void;
  onMockDataStatus?: (isUsingMockData: boolean) => void;
}

const getMockDishes = (): Dish[] => [
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
      name: "비빔밥",
      description: "건강한 비빔밥",
      image: "/images/home.png",
      ingredients: [
        { name: "쌀", from: "한국" },
        { name: "나물", from: "한국" },
        { name: "고추장", from: "한국" }
      ],
      price: 9000,
      toppings: [
        { name: "계란 후라이", price: 1000 },
        { name: "고기", price: 2500 }
      ],
      tag: [{ hot: false, new: false, picked: true }],
      type: "밥"
    }
  }
];

export default function DishList({ onDishSelect, onMockDataStatus }: DishListProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const dishData = await dishService.getDishes();
        setDishes(dishData);
        setIsUsingMockData(false);
        onMockDataStatus?.(false);
        console.log('✅ API 연결 성공 - 실제 데이터 로드됨');
        
      } catch (apiError) {
        console.warn('⚠️ API 연결 실패 - 목 데이터로 대체:', apiError);
        
        // Fallback to mock data
        const mockDishes = getMockDishes();
        setDishes(mockDishes);
        setIsUsingMockData(true);
        onMockDataStatus?.(true);
        
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const mapTagsToMenuPreview = (tags: Array<{ hot: boolean; new: boolean; picked: boolean }>) => {
    const result: Array<'new' | 'hot' | 'recommended'> = [];
    tags.forEach(tag => {
      if (tag.new) result.push('new');
      if (tag.hot) result.push('hot');
      if (tag.picked) result.push('recommended');
    });
    return result;
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dishList}>
      {isUsingMockData && (
        <div className={styles.mockDataNotice}>
          ⚠️ API 서버에 연결할 수 없어 테스트 데이터를 표시합니다
        </div>
      )}
      {dishes.map((dish) => (
        <div 
          key={dish.id} 
          className={styles.dishItem}
          onClick={() => onDishSelect?.(dish)}
        >
          <MenuPreview
            tags={mapTagsToMenuPreview(dish.dishData.tag)}
            title={dish.dishData.name}
            description={dish.dishData.description}
            price={dish.dishData.price}
            image={dish.dishData.image}
          />
        </div>
      ))}
    </div>
  );
}