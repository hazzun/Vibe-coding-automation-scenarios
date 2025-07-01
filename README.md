# No-code & Vibe-coding project (use for autonmation scenarios)

## 프로젝트 소개

이 서비스는 예산 별 결재라인에 대한 질문과 답변을 AI를 통해 제공하는 지능형 상담 서비스입니다.


### 개발 프로세스

1. **초기 프로토타입 설계**
   - Make.com을 활용한 자동화 시나리오 구축
   - GPT 기반 응답 생성 시스템 통합
   - 실시간 데이터베이스 연동 구조 설계

2. **프론트엔드 개발**
   - Lovable을 통한 초기 사이트 구조 설계
   - Cursor Vibe Coding을 활용한 반응형 UI 구현
   - shadcn-ui 컴포넌트 라이브러리 커스터마이징

3. **백엔드 통합**
   - Make.com 워크플로우와 프론트엔드 연동
   - 실시간 데이터 동기화 시스템 구현
   - API 엔드포인트 최적화


### 주요 기능

- 🤖 AI 기반 예산 규정 질의응답
- 📊 질문 카테고리 자동 분류 및 신뢰도 표시
- 👥 승인자 및 관련 문서 연동
- 📝 상세한 답변 제공 및 피드백 시스템
- 📚 질문 히스토리 관리


## 최근 업데이트

프로젝트가 다음과 같이 최적화 및 리팩토링되었습니다:
- 중복된 toast 구현을 제거하고 단일 Toaster 컴포넌트로 통합
- 사용하지 않는 UI 컴포넌트 제거로 번들 크기 감소
- 더 나은 유지보수를 위한 컴포넌트 구조 단순화


## 사용된 기술

- Vite - 빠른 빌드 도구 및 개발 서버
- TypeScript - 타입 안전한 JavaScript
- React - UI 라이브러리
- shadcn-ui - 아름답게 디자인된 컴포넌트
- Tailwind CSS - 유틸리티 우선 CSS 프레임워크
- React Query - 데이터 페칭 및 상태 관리
- React Router - 클라이언트 사이드 라우팅

---
---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/650974a6-9841-463c-a0d8-a76e4b53e654) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite - Fast build tool and development server
- TypeScript - Type-safe JavaScript
- React - UI library
- shadcn-ui - Beautifully designed components
- Tailwind CSS - Utility-first CSS framework
- React Query - Data fetching and state management
- React Router - Client-side routing

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/650974a6-9841-463c-a0d8-a76e4b53e654) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)