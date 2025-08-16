import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Dish, dishService } from '../../services/api';
import { authService, type BusinessInfo } from '../../services/auth';
import MenuForm from './components/menu-form';
import MenuTable from './components/menu-table';
import ApiStatusNotice from '../../components/ui/api-status-notice/api-status-notice';
import styles from './menu-management.module.css';

export default function MenuManagement() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  const loadDishes = async () => {
    try {
      setLoading(true);
      const result = await dishService.getDishes();
      setDishes(result.data);
      setIsUsingMockData(result.isUsingMockData);
    } catch (error) {
      console.error('메뉴 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDishes();
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    try {
      const info = await authService.getCurrentUser();
      setBusinessInfo(info);
    } catch (error) {
      console.error('사업자 정보 로드 실패:', error);
    }
  };

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        await authService.logout();
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 실패:', error);
        navigate('/login');
      }
    }
  };

  const handleAddMenu = () => {
    setSelectedDish(null);
    setIsFormOpen(true);
  };

  const handleEditMenu = (dish: Dish) => {
    setSelectedDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteMenu = async (dishId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await dishService.deleteDish(dishId);
        setDishes(dishes.filter(dish => dish.id !== dishId));
      } catch (error) {
        console.error('메뉴 삭제 실패:', error);
        alert('메뉴 삭제에 실패했습니다.');
      }
    }
  };

  const handleSaveMenu = async (dishData: Dish['dishData']) => {
    try {
      if (selectedDish) {
        const updatedDish = await dishService.updateDish(selectedDish.id, dishData);
        setDishes(dishes.map(dish => 
          dish.id === selectedDish.id ? updatedDish : dish
        ));
      } else {
        const newDish = await dishService.createDish(dishData);
        setDishes([...dishes, newDish]);
      }
      setIsFormOpen(false);
      setSelectedDish(null);
    } catch (error) {
      console.error('메뉴 저장 실패:', error);
      alert('메뉴 저장에 실패했습니다.');
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedDish(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>메뉴 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-page="menu-management">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>메뉴 관리</h1>
          {businessInfo && (
            <p className={styles.businessName}>{businessInfo.businessName}</p>
          )}
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.addButton}
            onClick={handleAddMenu}
          >
            + 새 메뉴 추가
          </button>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className={`${styles.content} ${isFormOpen ? styles.withForm : ''}`}>
        <div className={styles.tableSection}>
          <ApiStatusNotice isUsingMockData={isUsingMockData} />
          <MenuTable
            dishes={dishes}
            onEdit={handleEditMenu}
            onDelete={handleDeleteMenu}
          />
        </div>

        {isFormOpen && (
          <div className={styles.formSection}>
            <MenuForm
              dish={selectedDish}
              onSave={handleSaveMenu}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}