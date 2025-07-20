import styles from './tab_item.module.css';

interface TabItemProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function TabItem({ children, onClick }: TabItemProps) {
    return (
        <button className={styles.tab} onClick={onClick}>
            {children}
        </button>
    );
}