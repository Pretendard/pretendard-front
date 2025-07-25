import { useState, useEffect } from 'react';
import { type Dish } from '../../../services/api';
import MenuPreview from '../../ui/menu_preview/menu_preview';
import styles from './dish-list.module.css'

interface DishListProps {
  onDishSelect?: (dish: Dish) => void;
}

export default function DishList({ onDishSelect }: DishListProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for testing
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
      }
    ];
    
    setTimeout(() => {
      setDishes(mockDishes);
      setLoading(false);
    }, 500);
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