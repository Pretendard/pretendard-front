import styles from './cart_footer.module.css';
import SubmitButton from '../../../ui/submit_button/submit_button';

interface CartFooterProps {
    totalAmount: number;
    onOrder?: () => void;
}

export default function CartFooter({ totalAmount, onOrder }: CartFooterProps) {
    return (
        <div className={styles.cartFooter}>
            <div className={styles.totalText}>
                총 주문금액 {totalAmount.toLocaleString()}원
            </div>
            <SubmitButton onClick={onOrder}>
                주문하기
            </SubmitButton>
        </div>
    );
}