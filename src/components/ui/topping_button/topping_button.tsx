import styles from './topping_button.module.css';

interface ToppingButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ToppingButton({ onClick }: ToppingButtonProps) {
    return (
        <button className={styles.button} onClick={onClick}>
            토핑 변경
        </button>
    );
}