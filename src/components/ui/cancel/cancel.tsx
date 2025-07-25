import styles from './cancel.module.css';

interface CancelProps {
    onClick?: () => void;
}

export default function Cancel({ onClick }: CancelProps) {
    return (
        <div className={styles.box} onClick={onClick}>
            <img src="/svg/cancel.svg" alt="Cancel" className={styles.cancel} />
        </div>
    );
}