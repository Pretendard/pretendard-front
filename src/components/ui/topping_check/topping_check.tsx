import styles from './topping_check.module.css';

import check from '/svg/check.svg';
import checked from '/svg/checked.svg';

interface ToppingCheckProps {
    name: string;
    price: number;
    selected?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ToppingCheck({ name, price, selected, onClick }: ToppingCheckProps) {
    const getCheckedImage = () => {
        switch (selected) {
            case true: return checked;
            case false: return check;
            default: return check;
        }
    }

    const formated = new Intl.NumberFormat('ko-KR').format(price);

    return (
        <button className={styles.content} onClick={onClick}>
            <img 
                src={getCheckedImage()} 
                alt="Check" 
                className={`${styles.check} ${selected ? styles.selected : ''}`}
            />
            
            <div className={styles.texts}>
                <span className={styles.name}>{name}</span>
                <span className={styles.price}> (+{formated}원)</span>
            </div>
        </button>
    );
}