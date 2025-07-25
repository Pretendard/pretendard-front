import Tags from '../tags/tags';
import styles from './menu_preview.module.css';

interface MenuPreviewProps {
    tags: Array<'new' | 'hot' | 'recommended'>;
    description: string;
    title: string;
    price: number;
    image: string; // URL
}

export default function MenuPreview({ tags, title, description, price }: MenuPreviewProps) {

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
                <img src="/images/home.png" alt="음식 이미지" />
            </div>
            </div>
        </div>
    );
}