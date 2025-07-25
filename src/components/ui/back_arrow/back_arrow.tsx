import styles from './back_arrow.module.css';
import whiteArrowSvg from '/svg/arrow_back.svg';
import blackArrowSvg from '/svg/arrow_back_dark.svg';

interface BackArrowProps {
    color?: 'white' | 'black';
    onClick?: () => void;
}

export default function BackArrow({ color, onClick }: BackArrowProps) {
    const getSvgSource = () => {
        switch(color) {
            case 'white': return whiteArrowSvg;
            case 'black': return blackArrowSvg;
            default: return blackArrowSvg;
        }
    };

    return (
        <div className={styles.arrowbox} onClick={onClick}>
            <img src={getSvgSource()} alt="Back Arrow" className={styles.arrow} />
        </div>
    );
}