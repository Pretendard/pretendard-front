import { useState, useEffect } from 'react';
import { type Dish, dishService } from '../../../services/api';
import MenuPreview from '../../ui/menu_preview/menu_preview';
import styles from './dish-list.module.css'

interface DishListProps {
  onDishSelect?: (dish: Dish) => void;
  onMockDataStatus?: (isUsingMockData: boolean) => void;
}

export default function DishList({ onDishSelect, onMockDataStatus }: DishListProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const result = await dishService.getDishes();
        setDishes(result.data);
        onMockDataStatus?.(result.isUsingMockData);
      } catch (error) {
        console.error('메뉴 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, [onMockDataStatus]);

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