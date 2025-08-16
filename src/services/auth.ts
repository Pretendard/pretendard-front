import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

export interface BusinessInfo {
  id: number;
  businessNumber: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  username: string;
  createdAt: string;
}

export interface RegisterData {
  businessNumber: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  business: BusinessInfo;
  message: string;
}

// 목데이터
const mockBusinesses: (BusinessInfo & { password: string })[] = [
  {
    id: 1,
    businessNumber: '123-45-67890',
    businessName: 'Demo Restaurant',
    ownerName: '데모 사장',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    username: 'demo',
    password: 'demo1234',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const authService = {
  async checkUsername(username: string): Promise<{ available: boolean; message: string }> {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data;
    } catch (error: any) {
      console.warn('API 연결 실패, 목데이터를 사용합니다:', error);
      
      // 목데이터 모드에서 중복 확인
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isUsed = mockBusinesses.some(b => b.username === username);
      
      return {
        available: !isUsed,
        message: isUsed ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
      };
    }
  },

  async register(data: RegisterData): Promise<BusinessInfo> {
    try {
      const response = await api.post<BusinessInfo>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.warn('API 연결 실패, 목데이터를 사용합니다:', error);
      
      // 목데이터 모드에서 중복 검사
      const existingBusiness = mockBusinesses.find(
        b => b.businessNumber === data.businessNumber || b.username === data.username
      );
      
      if (existingBusiness) {
        if (existingBusiness.businessNumber === data.businessNumber) {
          throw new Error('이미 등록된 사업자번호입니다.');
        }
        if (existingBusiness.username === data.username) {
          throw new Error('이미 사용 중인 아이디입니다.');
        }
      }

      // 새 사업자 등록 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBusiness: BusinessInfo & { password: string } = {
        id: mockBusinesses.length + 1,
        ...data,
        createdAt: new Date().toISOString()
      };
      
      mockBusinesses.push(newBusiness);
      
      // 비밀번호 제외하고 반환
      const { password, ...businessInfo } = newBusiness;
      return businessInfo;
    }
  },

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.warn('API 연결 실패, 목데이터를 사용합니다:', error);
      
      // 목데이터 모드에서 로그인 처리
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const business = mockBusinesses.find(
        b => b.username === username && b.password === password
      );
      
      if (!business) {
        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
      }

      // 비밀번호 제외하고 반환
      const { password: _, ...businessInfo } = business;
      
      return {
        token: `mock_token_${Date.now()}`,
        business: businessInfo,
        message: '로그인에 성공했습니다.'
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('API 연결 실패, 로컬에서 처리합니다:', error);
    } finally {
      // 로컬 토큰 제거
      localStorage.removeItem('authToken');
      localStorage.removeItem('businessInfo');
    }
  },

  async getCurrentUser(): Promise<BusinessInfo | null> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const response = await api.get<BusinessInfo>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.warn('API 연결 실패, 로컬 스토리지를 사용합니다:', error);
      
      // 목데이터 모드에서는 로컬 스토리지에서 정보 가져오기
      const businessInfo = localStorage.getItem('businessInfo');
      return businessInfo ? JSON.parse(businessInfo) : null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};

// API 요청 시 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 응답 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;