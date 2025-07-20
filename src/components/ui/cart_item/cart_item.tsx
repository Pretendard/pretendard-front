import styles from './cart_item.module.css';
import Counter from '../counter/counter';
import Cancel from '../cancel/cancel';
import ToppingButton from '../topping_button/topping_button';

interface CartItemProps {
    name: string;
    price: number;
    totalPrice: number;
    quantity: number;
    imageUrl?: string;
    toppings?: string[];
    onQuantityChange?: (quantity: number) => void;
    onToppingChange?: () => void;
    onRemove?: () => void;
}

export default function CartItem({ 
    name, 
    price, 
    totalPrice,
    quantity, 
    imageUrl, 
    toppings = [],
    onQuantityChange,
    onToppingChange
}: CartItemProps) {
    return (
        <div className={styles.cartItem}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.image}>
                        <img src={imageUrl || "/images/home.png"} alt={name} />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.nameRow}>
                            <div className={styles.name}>{name}</div>
                            <Cancel />
                        </div>
                        <div className={styles.price}>{price.toLocaleString()}원</div>
                    </div>
                </div>
                <div className={styles.toppings}>
                    {toppings.map((topping, index) => (
                        <div key={index} className={styles.topping}>
                            {topping}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.controls}>
                <div className={styles.total}>
                    <span className={styles.totalLabel}>합계</span>
                    <span className={styles.totalPrice}>
                        {totalPrice.toLocaleString()}원
                    </span>
                </div>
                <div className={styles.actions}>
                    {/* 첫 번째 버튼이므로 :first-child override가 적용됩니다 */}
                    <ToppingButton onClick={onToppingChange} />
                    <Counter 
                        initialValue={quantity} 
                        onChange={onQuantityChange}
                        min={1}
                        max={99}
                    />
                </div>
            </div>
        </div>
    );
}