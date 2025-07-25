import BackArrow from '../../../ui/back_arrow/back_arrow';
import styles from './cart_header.module.css';

interface CartHeaderProps {
    onBack?: () => void;
}

export default function CartHeader({ onBack }: CartHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <BackArrow color="black" onClick={onBack} />
                <p className={styles.text}>장바구니</p>
            </div>
        </div>
    );
}