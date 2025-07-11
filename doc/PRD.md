1.PRD (Product Requirements Document)
1.1 제품 개요
제품명: OK 예산전결 알려DREAM
목적: 예산 규정과 결재라인에 대한 질의응답을 AI를 통해 제공하는 지능형 상담 서비스
1.2 주요 기능
1.2.1 AI 기반 질의응답
자연어 기반 예산 관련 질문 입력
GPT 기반 답변 생성
카테고리 자동 분류 및 신뢰도 표시
실시간 답변 생성
1.2.2 추가 정보 입력
예산 금액 입력
집행 절차 선택 (추가경정/조기집행/이관/전용)
맞춤형 상세 답변 생성
1.2.3 질문 기록 관리
실시간 데이터베이스 연동 (Supabase)
전체 사용자의 질문 기록 공유
질문 기록 실시간 업데이트
개별 질문 삭제 기능
1.2.4 사용자 피드백
답변 만족도 평가
피드백 기반 시스템 개선
1.3 기술 스택
Frontend: React + TypeScript + Vite
UI: shadcn/ui + Tailwind CSS
상태관리: React Query
데이터베이스: Supabase
배포: Vercel
1.4 성능 요구사항
페이지 초기 로딩 시간: 2초 이내
질문 답변 생성 시간: 5초 이내
실시간 업데이트 지연: 1초 이내