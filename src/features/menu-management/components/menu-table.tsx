import { type Dish } from '../../../services/api';
import Tags from '../../../components/ui/tags/tags';
import styles from './menu-table.module.css';

// 이미지 URL을 표시용으로 변환하는 함수
const getImageUrl = (imagePath: string): string => {
  // 목데이터 모드에서는 로컬 스토리지에서 가져오기
  if (imagePath.startsWith('/images/mock_')) {
    const stored = localStorage.getItem(imagePath);
    return stored || '/images/home.png';
  }
  
  // 서버 이미지는 그대로 반환
  return imagePath;
};

interface MenuTableProps {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
  onDelete: (dishId: number) => void;
}

export default function MenuTable({ dishes, onEdit, onDelete }: MenuTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getTags = (tags: Array<{ hot: boolean; new: boolean; picked: boolean }>) => {
    const result: Array<'new' | 'hot' | 'recommended'> = [];
    tags.forEach(tag => {
      if (tag.new) result.push('new');
      if (tag.hot) result.push('hot');
      if (tag.picked) result.push('recommended');
    });
    return result;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>이미지</th>
            <th>메뉴명</th>
            <th>설명</th>
            <th>가격</th>
            <th>태그</th>
            <th>카테고리</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td>
                <div className={styles.imageCell}>
                  <img 
                    src={getImageUrl(dish.dishData.image)} 
                    alt={dish.dishData.name}
                    className={styles.menuImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/home.png';
                    }}
                  />
                </div>
              </td>
              <td>
                <div className={styles.nameCell}>
                  {dish.dishData.name}
                </div>
              </td>
              <td>
                <div className={styles.descriptionCell}>
                  {dish.dishData.description}
                </div>
              </td>
              <td>
                <div className={styles.priceCell}>
                  {formatPrice(dish.dishData.price)}원
                </div>
              </td>
              <td>
                <div className={styles.tagsCell}>
                  {getTags(dish.dishData.tag).map((tag) => (
                    <Tags key={tag} tag={tag} />
                  ))}
                </div>
              </td>
              <td>
                <div className={styles.categoryCell}>
                  {dish.dishData.type}
                </div>
              </td>
              <td>
                <div className={styles.actionsCell}>
                  <button 
                    className={styles.editButton}
                    onClick={() => onEdit(dish)}
                  >
                    편집
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => onDelete(dish.id)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {dishes.length === 0 && (
        <div className={styles.emptyState}>
          등록된 메뉴가 없습니다.
        </div>
      )}
    </div>
  );
}