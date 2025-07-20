import { useState } from 'react';
import styles from './counter.module.css';

interface CounterProps {
    initialValue?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
}

export default function Counter({ initialValue = 0, min = 0, max = 99, onChange }: CounterProps) {
    const [value, setValue] = useState(initialValue);

    const handleIncrement = () => {
        const newValue = Math.min(value + 1, max);
        setValue(newValue);
        onChange?.(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(value - 1, min);
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <div className={styles.counter}>
            <button 
                className={styles.button}
                onClick={handleDecrement}
                disabled={value <= min}
            >
                -
            </button>
            <span className={styles.value}>{value}</span>
            <button 
                className={styles.button}
                onClick={handleIncrement}
                disabled={value >= max}
            >
                +
            </button>
        </div>
    );
}