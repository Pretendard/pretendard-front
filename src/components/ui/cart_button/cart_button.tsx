import styles from './cart_button.module.css';
import red from '/svg/cart_red.svg';
import white from '/svg/cart_white.svg';

interface CartButtonProps {
    onClick?: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
    return (
        <button 
            className={styles.cartButton}
            onClick={onClick}
        >
            <img src={red} alt="Cart" className={`${styles.cartIcon} ${styles.normal}`} />
            <img src={white} alt="Cart" className={`${styles.cartIcon} ${styles.hover}`} />
        </button>
    );
}