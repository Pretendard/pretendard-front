import Tags from '../tags/tags';
import styles from './menu_preview.module.css';

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

interface MenuPreviewProps {
    tags: Array<'new' | 'hot' | 'recommended'>;
    description: string;
    title: string;
    price: number;
    image: string; // URL
}

export default function MenuPreview({ tags, title, description, price, image }: MenuPreviewProps) {

    const formated = new Intl.NumberFormat('ko-KR').format;

    return (
        <div className={styles.menu}>
            <div className={styles.tags}>
                {tags.map((t) => (
                    <Tags key={t} tag={t} />
                ))}
            </div>

            <div className={styles.contents}>
                <div className={styles.texts}>
                    <div className={styles.title}>
                        {title}
                    </div>

                <div className={styles.description}>
                    {description}
                </div>

                <div className={styles.price}>
                    {formated(price)}원
                </div>
            </div>

            <div className={styles.image}>
                <img 
                    src={getImageUrl(image)} 
                    alt="음식 이미지"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/home.png';
                    }}
                />
            </div>
            </div>
        </div>
    );
}