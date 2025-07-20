import styles from './tags.module.css';

interface TagProps {
    tag: 'new' | 'hot' | 'recommended';
}

const LABELS: Record<TagProps['tag'], string> = {
    new: 'NEW',
    hot: 'HOT',
    recommended: '사장님의 픽',
};

export default function Tag({ tag }: TagProps) {
    const label = LABELS[tag];
    const kindClass = styles[tag];

    return (
        <div className={`${styles.tag} ${kindClass}`}>
            <span className={styles.text}>{label}</span>
        </div>
    );
}