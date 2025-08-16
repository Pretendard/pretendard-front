import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import BusinessVerification from '../../components/business/BusinessVerification';
import UsernameChecker from '../../components/auth/UsernameChecker';
import styles from './auth.module.css';

interface BusinessInfo {
  businessNumber: string;
  businessName: string;
  ownerName: string;
  startDate: string;
  businessStatus: string;
  taxType: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'verification' | 'registration'>('verification');
  const [verifiedBusiness, setVerifiedBusiness] = useState<BusinessInfo | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const handleBusinessVerificationSuccess = (businessInfo: BusinessInfo) => {
    setVerifiedBusiness(businessInfo);
    setCurrentStep('registration');
    setErrors({});
  };

  const handleBusinessVerificationError = (error: string) => {
    console.error('사업자 검증 실패:', error);
  };

  const validateRegistrationForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 전화번호 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    // 주소 검증
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    // 아이디 검증
    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요.';
    } else if (!isUsernameValid) {
      newErrors.username = '아이디 중복 확인이 필요합니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
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

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleBackToVerification = () => {
    setCurrentStep('verification');
    setVerifiedBusiness(null);
    setErrors({});
    setIsUsernameValid(false);
  };

  const handleUsernameChange = (username: string) => {
    handleInputChange('username', username);
    setIsUsernameValid(false);
  };

  const handleUsernameValidation = (isValid: boolean) => {
    setIsUsernameValid(isValid);
    if (isValid && errors.username) {
      setErrors(prev => ({ ...prev, username: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifiedBusiness) {
      alert('먼저 사업자 정보를 확인해주세요.');
      return;
    }
    
    if (!validateRegistrationForm()) return;

    try {
      setIsLoading(true);
      await authService.register({
        businessNumber: verifiedBusiness.businessNumber,
        businessName: verifiedBusiness.businessName,
        ownerName: verifiedBusiness.ownerName,
        phone: formData.phone,
        address: formData.address,
        username: formData.username,
        password: formData.password
      });
      
      alert('가게 등록이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      alert(error.message || '가게 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'verification') {
    return (
      <div className={styles.container} data-page="auth">
        <div className={styles.authCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>가게 등록</h1>
            <p className={styles.subtitle}>1단계: 사업자등록정보 확인</p>
          </div>

          <BusinessVerification
            onVerificationSuccess={handleBusinessVerificationSuccess}
            onVerificationError={handleBusinessVerificationError}
          />

          <div className={styles.actions}>
            <p className={styles.loginLink}>
              이미 계정이 있으신가요? 
              <button 
                type="button" 
                className={styles.linkButton}
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-page="auth">
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>가게 등록</h1>
          <p className={styles.subtitle}>2단계: 추가 정보 입력</p>
        </div>

        {verifiedBusiness && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>확인된 사업자 정보</h3>
            <div className={styles.verifiedInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>사업자번호:</span>
                <span className={styles.infoValue}>{verifiedBusiness.businessNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>상호명:</span>
                <span className={styles.infoValue}>{verifiedBusiness.businessName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>대표자명:</span>
                <span className={styles.infoValue}>{verifiedBusiness.ownerName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>사업자상태:</span>
                <span className={styles.infoValue}>{verifiedBusiness.businessStatus}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBackToVerification}
              className={styles.backButton}
            >
              ← 사업자 정보 다시 입력
            </button>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>연락처 및 주소</h3>
            
            <div className={styles.field}>
              <label className={styles.label}>전화번호 *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                placeholder="010-1234-5678"
                maxLength={13}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>주소 *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`${styles.input} ${errors.address ? styles.error : ''}`}
                placeholder="서울시 강남구 테헤란로 123"
              />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>로그인 정보</h3>
            
            <div className={styles.field}>
              <label className={styles.label}>아이디 *</label>
              <UsernameChecker
                username={formData.username}
                onUsernameChange={handleUsernameChange}
                onValidationChange={handleUsernameValidation}
                error={errors.username}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호 *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                placeholder="8자 이상"
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호 확인 *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '등록 중...' : '가게 등록 완료'}
            </button>
            
            <p className={styles.loginLink}>
              이미 계정이 있으신가요? 
              <button 
                type="button" 
                className={styles.linkButton}
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}