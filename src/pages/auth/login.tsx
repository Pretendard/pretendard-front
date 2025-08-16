import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import styles from './auth.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const result = await authService.login(formData.username, formData.password);
      
      // 로그인 성공 시 토큰 저장 및 리다이렉트
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('businessInfo', JSON.stringify(result.business));
      
      alert(`${result.business.businessName}님 환영합니다!`);
      navigate('/menu-management');
    } catch (error: any) {
      setErrors({ general: error.message || '로그인에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container} data-page="auth">
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>가게 관리 시스템에 로그인하세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.generalError}>
              {errors.general}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`${styles.input} ${errors.username ? styles.error : ''}`}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
            
            <p className={styles.loginLink}>
              계정이 없으신가요? 
              <button 
                type="button" 
                className={styles.linkButton}
                onClick={() => navigate('/register')}
              >
                가게 등록
              </button>
            </p>
          </div>
        </form>

        <div className={styles.demoInfo}>
          <h4>데모 계정</h4>
          <p>아이디: demo / 비밀번호: demo1234</p>
        </div>
      </div>
    </div>
  );
}