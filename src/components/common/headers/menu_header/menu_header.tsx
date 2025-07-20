// MenuHeader.tsx
import styles from './menu_header.module.css';

interface MenuHeaderProps {
    table: string;
    store: string;
}

export default function MenuHeader({ table, store }: MenuHeaderProps) {
    return (
        <div className={styles.tab}>
            {/* texts 래퍼 추가 */}
            <div className={styles.texts}>
                <p className={styles.table}>테이블 번호: {table}</p>
                <p className={styles.storeName}>{store}</p>
            </div>
        </div>
    );
}