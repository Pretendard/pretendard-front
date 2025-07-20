// MenuHeader.tsx
import BackArrow from '../../../ui/back_arrow/back_arrow';
import styles from './cart_header.module.css';

export default function CartHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <BackArrow color="black" />
                <p className={styles.text}>장바구니</p>
            </div>
        </div>
    );
}