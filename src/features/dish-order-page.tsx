import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Dish } from '../services/api';
import MenuHeader from '../components/common/headers/menu_header/menu_header';
import CartHeader from '../components/common/headers/cart_header/cart_header';
import DishList from './dish-list/dish-list';
import OrderCart from './order-cart/order-cart';
import styles from './dish-order-page.module.css';

export default function DishOrderPage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'list' | 'cart'>('list');
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
    setCurrentView('cart');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDish(undefined);
  };

  const handleOrderComplete = () => {
    setCurrentView('list');
    setSelectedDish(undefined);
  };

  const handleMockDataStatus = (usingMockData: boolean) => {
    setIsUsingMockData(usingMockData);
  };

  return (
    <div className={styles.dishOrderPage}>
      {/* 어드민 페이지 임시 버튼 */}
      <button
        onClick={() => navigate('/login')}
        className={styles.adminButton}
        title="어드민 페이지로 이동"
      >
        👑 Admin
      </button>

      {currentView === 'list' ? (
        <>
          <MenuHeader table="1" store="Pretendard Restaurant" />
          <div className={`${styles.content} ${isUsingMockData ? styles.withMockNotice : ''}`}>
            <DishList onDishSelect={handleDishSelect} onMockDataStatus={handleMockDataStatus} />
          </div>
        </>
      ) : (
        <>
          <CartHeader onBack={handleBackToList} />
          <div className={styles.content}>
            <OrderCart 
              selectedDish={selectedDish}
              onOrderComplete={handleOrderComplete}
            />
          </div>
        </>
      )}
    </div>
  );
}