import { useState } from 'react';
import { businessService } from '../../services/business';
import styles from './BusinessVerification.module.css';

interface BusinessInfo {
  businessNumber: string;
  businessName: string;
  ownerName: string;
  startDate: string;
  businessStatus: string;
  taxType: string;
}

interface BusinessVerificationProps {
  onVerificationSuccess: (businessInfo: BusinessInfo) => void;
  onVerificationError: (error: string) => void;
}

export default function BusinessVerification({ 
  onVerificationSuccess, 
  onVerificationError 
}: BusinessVerificationProps) {
  const [formData, setFormData] = useState({
    businessNumber: '',
    ownerName: '',
    startDate: '',
    businessName: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'businessNumber') {
      formattedValue = businessService.formatBusinessNumber(value);
    } else if (field === 'startDate') {
      // 날짜 포맷팅 (YYYY-MM-DD)
      const numbers = value.replace(/[^\d]/g, '');
      if (numbers.length <= 4) {
        formattedValue = numbers;
      } else if (numbers.length <= 6) {
        formattedValue = `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
      } else {
        formattedValue = `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // 입력 변경 시 검증 상태 초기화
    if (verificationStatus !== 'none') {
      setVerificationStatus('none');
      setVerificationMessage('');
    }
  };

  const validateForm = (): string | null => {
    if (!formData.businessNumber) {
      return '사업자번호를 입력해주세요.';
    }
    
    if (!businessService.validateBusinessNumber(formData.businessNumber)) {
      return '올바른 사업자번호를 입력해주세요.';
    }
    
    if (!formData.ownerName.trim()) {
      return '대표자명을 입력해주세요.';
    }
    
    if (!formData.startDate) {
      return '개업일자를 입력해주세요.';
    }
    
    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.startDate)) {
      return '올바른 개업일자를 입력해주세요. (YYYY-MM-DD)';
    }
    
    return null;
  };

  const handleVerification = async () => {
    const error = validateForm();
    if (error) {
      setVerificationStatus('error');
      setVerificationMessage(error);
      onVerificationError(error);
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationStatus('none');
      
      const cleanBusinessNumber = businessService.cleanBusinessNumber(formData.businessNumber);
      const cleanStartDate = formData.startDate.replace(/-/g, '');
      
      // 사업자 진위확인 API 호출
      const verificationResult = await businessService.verifyBusiness({
        businesses: [{
          b_no: cleanBusinessNumber,
          start_dt: cleanStartDate,
          p_nm: formData.ownerName,
          b_nm: formData.businessName || undefined
        }]
      });

      if (verificationResult.status_code !== 'OK' || verificationResult.data.length === 0) {
        throw new Error('사업자 정보 조회에 실패했습니다.');
      }

      const businessData = verificationResult.data[0];
      
      if (businessData.valid !== '01') {
        setVerificationStatus('error');
        setVerificationMessage('입력하신 사업자 정보가 일치하지 않습니다. 다시 확인해주세요.');
        onVerificationError('사업자 정보 불일치');
        return;
      }

      // 사업자 상태 확인
      if (businessData.status.b_stt_cd === '03') {
        setVerificationStatus('error');
        setVerificationMessage('폐업된 사업자번호입니다.');
        onVerificationError('폐업된 사업자');
        return;
      }

      // 검증 성공
      setVerificationStatus('success');
      setVerificationMessage('사업자 정보가 확인되었습니다.');
      
      const businessInfo: BusinessInfo = {
        businessNumber: formData.businessNumber,
        businessName: formData.businessName || businessData.request_param.b_nm || '',
        ownerName: formData.ownerName,
        startDate: formData.startDate,
        businessStatus: businessData.status.b_stt,
        taxType: businessData.status.tax_type
      };
      
      onVerificationSuccess(businessInfo);

    } catch (error: any) {
      console.error('사업자 검증 실패:', error);
      setVerificationStatus('error');
      setVerificationMessage(error.message || '사업자 정보 확인 중 오류가 발생했습니다.');
      onVerificationError(error.message || '검증 실패');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    switch (verificationStatus) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>사업자등록정보 확인</h3>
        <p className={styles.subtitle}>
          공공데이터포털 API를 통해 사업자 정보를 확인합니다
        </p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>사업자번호 *</label>
          <input
            type="text"
            value={formData.businessNumber}
            onChange={(e) => handleInputChange('businessNumber', e.target.value)}
            className={styles.input}
            placeholder="123-45-67890"
            maxLength={12}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>대표자명 *</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className={styles.input}
            placeholder="홍길동"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>개업일자 *</label>
          <input
            type="text"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={styles.input}
            placeholder="YYYY-MM-DD"
            maxLength={10}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>상호명 (선택)</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className={styles.input}
            placeholder="Pretendard Restaurant"
          />
          <small className={styles.fieldHint}>
            입력하지 않으면 등록된 상호명을 자동으로 가져옵니다
          </small>
        </div>

        <button
          type="button"
          onClick={handleVerification}
          disabled={isVerifying}
          className={styles.verifyButton}
        >
          {isVerifying ? '확인 중...' : '사업자정보 확인'}
        </button>

        {verificationMessage && (
          <div className={`${styles.message} ${getStatusClass()}`}>
            <span className={styles.icon}>{getStatusIcon()}</span>
            <span>{verificationMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}