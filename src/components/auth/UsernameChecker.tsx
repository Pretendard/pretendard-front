import { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import styles from './UsernameChecker.module.css';

interface UsernameCheckerProps {
  username: string;
  onUsernameChange: (username: string) => void;
  onValidationChange: (isValid: boolean) => void;
  error?: string;
}

export default function UsernameChecker({ 
  username, 
  onUsernameChange, 
  onValidationChange, 
  error 
}: UsernameCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ available: boolean; message: string } | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // 디바운싱을 위한 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && hasChecked) {
        setCheckResult(null);
        setHasChecked(false);
        onValidationChange(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username, hasChecked, onValidationChange]);

  const handleUsernameChange = (value: string) => {
    onUsernameChange(value);
    if (hasChecked) {
      setCheckResult(null);
      setHasChecked(false);
      onValidationChange(false);
    }
  };

  const validateUsername = (value: string): string | null => {
    if (!value) return '아이디를 입력해주세요.';
    if (value.length < 4) return '아이디는 4자 이상이어야 합니다.';
    if (value.length > 20) return '아이디는 20자 이하여야 합니다.';
    if (!/^[a-zA-Z0-9]+$/.test(value)) return '아이디는 영문과 숫자만 사용 가능합니다.';
    return null;
  };

  const handleCheckUsername = async () => {
    const validationError = validateUsername(username);
    if (validationError) {
      setCheckResult({ available: false, message: validationError });
      setHasChecked(true);
      onValidationChange(false);
      return;
    }

    try {
      setIsChecking(true);
      const result = await authService.checkUsername(username);
      setCheckResult(result);
      setHasChecked(true);
      onValidationChange(result.available);
    } catch (error) {
      setCheckResult({ 
        available: false, 
        message: '아이디 확인 중 오류가 발생했습니다.' 
      });
      setHasChecked(true);
      onValidationChange(false);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    if (isChecking) return '⏳';
    if (!checkResult) return '';
    return checkResult.available ? '✅' : '❌';
  };

  const getStatusClass = () => {
    if (!checkResult) return '';
    return checkResult.available ? styles.success : styles.error;
  };

  const canCheck = username.length >= 4 && !hasChecked;

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          className={`${styles.input} ${error || (checkResult && !checkResult.available) ? styles.inputError : ''} ${checkResult?.available ? styles.inputSuccess : ''}`}
          placeholder="4-20자의 영문, 숫자"
          maxLength={20}
        />
        <button
          type="button"
          onClick={handleCheckUsername}
          disabled={!canCheck || isChecking}
          className={styles.checkButton}
        >
          {isChecking ? '확인 중...' : '중복 확인'}
        </button>
      </div>
      
      {(error || checkResult) && (
        <div className={`${styles.message} ${getStatusClass()}`}>
          <span className={styles.icon}>{getStatusIcon()}</span>
          <span>{error || checkResult?.message}</span>
        </div>
      )}

      {checkResult?.available && (
        <div className={styles.hint}>
          이 아이디로 가게를 등록할 수 있습니다.
        </div>
      )}
    </div>
  );
}