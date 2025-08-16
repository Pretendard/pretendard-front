import styles from './api-status-notice.module.css';

interface ApiStatusNoticeProps {
  isUsingMockData: boolean;
}

export default function ApiStatusNotice({ isUsingMockData }: ApiStatusNoticeProps) {
  if (!isUsingMockData) return null;

  return (
    <div className={styles.notice}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <div className={styles.title}>API 연결 실패</div>
        <div className={styles.description}>
          서버에 연결할 수 없어 목데이터를 사용 중입니다. 변경사항은 저장되지 않습니다.
        </div>
      </div>
    </div>
  );
}