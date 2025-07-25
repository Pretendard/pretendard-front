import styles from './submit_button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
    return (
        <button className={styles.btn} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}