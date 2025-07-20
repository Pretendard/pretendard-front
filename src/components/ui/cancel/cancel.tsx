import styles from './cancel.module.css';

export default function Cancel() {
    return (
        <div className={styles.box}>
            <img src="/svg/cancel.svg" alt="Cancel" className={styles.cancel} />
        </div>
    );
}