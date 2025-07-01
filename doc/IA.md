2.IA (Information Architecture)

2.1 사이트 구조

홈페이지
├── 헤더
│   └── 로고
├── 메인 섹션
│   ├── 질문 입력 폼
│   ├── 카테고리 표시
│   ├── 추가 정보 입력
│   │   ├── 예산 금액
│   │   └── 집행 절차
│   ├── 답변 표시
│   │   ├── 상세 답변
│   │   └── 피드백 버튼
│   └── 질문 기록
│       ├── 질문 목록
│       └── 질문 상세
└── 로딩 오버레이

2.2 데이터 구조
2.2.1 질문 기록 (QuestionHistory)
{
  id: string;
  created_at: string;
  question: string;
  category: string;
  confidence: number;
  answer: string;
  approver?: string;
  document?: string;
  amount?: string;
  procedure?: string;
  user_id?: string;
}