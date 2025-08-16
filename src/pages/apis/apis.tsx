import { useState } from 'react';
import styles from './apis.module.css';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: object;
  responseBody?: object;
  parameters?: { name: string; type: string; description: string; required: boolean }[];
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/dish',
    description: '모든 메뉴 목록을 조회합니다.',
    responseBody: [
      {
        id: 1,
        dishData: {
          name: "김치찌개",
          description: "맛있는 김치찌개입니다",
          image: "/images/kimchi_jjigae.jpg",
          ingredients: [
            { name: "김치", from: "한국" },
            { name: "돼지고기", from: "한국" }
          ],
          price: 8000,
          toppings: [
            { name: "치즈", price: 1000 },
            { name: "라면사리", price: 1500 }
          ],
          tag: [{ hot: true, new: false, picked: true }],
          type: "찌개"
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/dish',
    description: '새로운 메뉴를 추가합니다.',
    requestBody: {
      name: "불고기",
      description: "달콤한 불고기",
      image: "/images/bulgogi.jpg",
      ingredients: [
        { name: "소고기", from: "한국" }
      ],
      price: 15000,
      toppings: [
        { name: "버섯", price: 2000 }
      ],
      tag: [{ hot: false, new: true, picked: false }],
      type: "고기"
    },
    responseBody: {
      id: 2,
      dishData: {
        name: "불고기",
        description: "달콤한 불고기",
        image: "/images/bulgogi.jpg",
        ingredients: [
          { name: "소고기", from: "한국" }
        ],
        price: 15000,
        toppings: [
          { name: "버섯", price: 2000 }
        ],
        tag: [{ hot: false, new: true, picked: false }],
        type: "고기"
      }
    }
  },
  {
    method: 'PUT',
    path: '/dish/:id',
    description: '기존 메뉴를 수정합니다.',
    parameters: [
      { name: 'id', type: 'number', description: '수정할 메뉴의 ID', required: true }
    ],
    requestBody: {
      name: "김치찌개 (수정됨)",
      description: "더욱 맛있는 김치찌개입니다",
      image: "/images/kimchi_jjigae_updated.jpg",
      ingredients: [
        { name: "김치", from: "한국" },
        { name: "돼지고기", from: "한국" },
        { name: "두부", from: "한국" }
      ],
      price: 9000,
      toppings: [
        { name: "치즈", price: 1000 },
        { name: "라면사리", price: 1500 }
      ],
      tag: [{ hot: true, new: false, picked: true }],
      type: "찌개"
    },
    responseBody: {
      id: 1,
      dishData: {
        name: "김치찌개 (수정됨)",
        description: "더욱 맛있는 김치찌개입니다",
        image: "/images/kimchi_jjigae_updated.jpg",
        ingredients: [
          { name: "김치", from: "한국" },
          { name: "돼지고기", from: "한국" },
          { name: "두부", from: "한국" }
        ],
        price: 9000,
        toppings: [
          { name: "치즈", price: 1000 },
          { name: "라면사리", price: 1500 }
        ],
        tag: [{ hot: true, new: false, picked: true }],
        type: "찌개"
      }
    }
  },
  {
    method: 'DELETE',
    path: '/dish/:id',
    description: '메뉴를 삭제합니다.',
    parameters: [
      { name: 'id', type: 'number', description: '삭제할 메뉴의 ID', required: true }
    ],
    responseBody: {
      message: "메뉴가 성공적으로 삭제되었습니다."
    }
  },
  {
    method: 'POST',
    path: '/images/upload',
    description: '이미지 파일을 업로드합니다.',
    requestBody: {
      image: "File (multipart/form-data)"
    },
    responseBody: {
      imagePath: "/images/uploaded_image_1234567890.jpg"
    }
  },
  {
    method: 'POST',
    path: '/dish/order',
    description: '메뉴를 주문합니다.',
    requestBody: [
      {
        name: "김치찌개",
        toppings: [
          { name: "치즈", price: 1000 },
          { name: "라면사리", price: 1500 }
        ]
      }
    ],
    responseBody: {
      message: "주문이 성공적으로 접수되었습니다.",
      orderId: "ORD_1234567890"
    }
  },
  // 인증 관련 API
  {
    method: 'POST',
    path: '/auth/register',
    description: '새로운 사업자를 등록합니다.',
    requestBody: {
      businessNumber: "123-45-67890",
      businessName: "Pretendard Restaurant",
      ownerName: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      username: "pretendard",
      password: "password123"
    },
    responseBody: {
      id: 1,
      businessNumber: "123-45-67890",
      businessName: "Pretendard Restaurant",
      ownerName: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      username: "pretendard",
      createdAt: "2024-01-01T00:00:00Z"
    }
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: '사업자 로그인을 수행합니다.',
    requestBody: {
      username: "pretendard",
      password: "password123"
    },
    responseBody: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      business: {
        id: 1,
        businessNumber: "123-45-67890",
        businessName: "Pretendard Restaurant",
        ownerName: "홍길동",
        phone: "010-1234-5678",
        address: "서울시 강남구 테헤란로 123",
        username: "pretendard",
        createdAt: "2024-01-01T00:00:00Z"
      },
      message: "로그인에 성공했습니다."
    }
  },
  {
    method: 'POST',
    path: '/auth/logout',
    description: '사업자 로그아웃을 수행합니다.',
    responseBody: {
      message: "로그아웃되었습니다."
    }
  },
  {
    method: 'GET',
    path: '/auth/me',
    description: '현재 로그인한 사업자 정보를 조회합니다.',
    responseBody: {
      id: 1,
      businessNumber: "123-45-67890",
      businessName: "Pretendard Restaurant",
      ownerName: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      username: "pretendard",
      createdAt: "2024-01-01T00:00:00Z"
    }
  },
  {
    method: 'GET',
    path: '/auth/check-username/:username',
    description: '아이디 중복 여부를 확인합니다.',
    parameters: [
      { name: 'username', type: 'string', description: '확인할 아이디', required: true }
    ],
    responseBody: {
      available: true,
      message: "사용 가능한 아이디입니다."
    }
  },
  // 사업자 검증 API (공공데이터포털 연동)
  {
    method: 'POST',
    path: '/business/v1/validate',
    description: '사업자등록정보 진위확인을 수행합니다. (공공데이터포털 API)',
    requestBody: {
      businesses: [
        {
          b_no: "1234567890",
          start_dt: "20200101",
          p_nm: "홍길동",
          p_nm2: "",
          b_nm: "Pretendard Restaurant",
          corp_no: "",
          b_sector: "",
          b_type: ""
        }
      ]
    },
    responseBody: {
      status_code: "OK",
      match_cnt: 1,
      request_cnt: 1,
      valid_cnt: 1,
      data: [
        {
          b_no: "1234567890",
          valid: "01",
          request_param: {
            b_no: "1234567890",
            start_dt: "20200101",
            p_nm: "홍길동",
            b_nm: "Pretendard Restaurant"
          },
          status: {
            b_no: "1234567890",
            b_stt: "계속사업자",
            b_stt_cd: "01",
            tax_type: "부가가치세 일반과세자",
            tax_type_cd: "01",
            end_dt: "",
            utcc_yn: "N",
            tax_type_change_dt: "",
            invoice_apply_dt: ""
          }
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/business/v1/status',
    description: '사업자등록상태를 조회합니다. (공공데이터포털 API)',
    requestBody: {
      b_no: ["1234567890", "0987654321"]
    },
    responseBody: {
      status_code: "OK",
      request_cnt: 2,
      valid_cnt: 2,
      data: [
        {
          b_no: "1234567890",
          b_stt: "계속사업자",
          b_stt_cd: "01",
          tax_type: "부가가치세 일반과세자",
          tax_type_cd: "01",
          end_dt: "",
          utcc_yn: "N",
          tax_type_change_dt: "",
          invoice_apply_dt: ""
        }
      ]
    }
  }
];

export default function Apis() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#28a745';
      case 'POST': return '#007bff';
      case 'PUT': return '#ffc107';
      case 'DELETE': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className={styles.container} data-page="apis">
      <header className={styles.header}>
        <h1 className={styles.title}>API Documentation</h1>
        <p className={styles.subtitle}>
          Pretendard Restaurant API 엔드포인트 목록 및 사용법
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>엔드포인트</h3>
          <div className={styles.endpointList}>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className={`${styles.endpointItem} ${selectedEndpoint === endpoint ? styles.active : ''}`}
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <span 
                  className={styles.method}
                  style={{ backgroundColor: getMethodColor(endpoint.method) }}
                >
                  {endpoint.method}
                </span>
                <span className={styles.path}>{endpoint.path}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          {selectedEndpoint ? (
            <div className={styles.endpointDetail}>
              <div className={styles.endpointHeader}>
                <span 
                  className={styles.methodBadge}
                  style={{ backgroundColor: getMethodColor(selectedEndpoint.method) }}
                >
                  {selectedEndpoint.method}
                </span>
                <h2 className={styles.endpointPath}>{selectedEndpoint.path}</h2>
              </div>

              <p className={styles.description}>{selectedEndpoint.description}</p>

              {selectedEndpoint.parameters && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Parameters</h3>
                  <div className={styles.parametersTable}>
                    <div className={styles.tableHeader}>
                      <span>Name</span>
                      <span>Type</span>
                      <span>Required</span>
                      <span>Description</span>
                    </div>
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className={styles.tableRow}>
                        <span className={styles.paramName}>{param.name}</span>
                        <span className={styles.paramType}>{param.type}</span>
                        <span className={styles.paramRequired}>
                          {param.required ? 'Yes' : 'No'}
                        </span>
                        <span className={styles.paramDescription}>{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEndpoint.requestBody && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Request Body</h3>
                  <pre className={styles.codeBlock}>
                    {JSON.stringify(selectedEndpoint.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEndpoint.responseBody && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Response Body</h3>
                  <pre className={styles.codeBlock}>
                    {JSON.stringify(selectedEndpoint.responseBody, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.placeholder}>
              <h3>API 엔드포인트를 선택하세요</h3>
              <p>왼쪽 목록에서 API 엔드포인트를 클릭하면 상세 정보를 확인할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}