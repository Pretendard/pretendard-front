import styles from './submit_button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <button className={styles.btn} onClick={onClick}>
            {children}
        </button>
    );
}