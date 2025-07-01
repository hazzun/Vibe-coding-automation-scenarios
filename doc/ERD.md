# ERD (Entity Relationship Diagram)

## 1. 테이블 구조

### 1.1 Users (사용자)
```
users
---
id UUID PK
email VARCHAR(255) UNIQUE NOT NULL
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
last_sign_in_at TIMESTAMP WITH TIME ZONE
```

### 1.2 Questions (질문 기록)
```
questions
---
id UUID PK
user_id UUID FK >- users.id
question TEXT NOT NULL
category VARCHAR(100) NOT NULL
confidence DECIMAL(4,3) NOT NULL
answer TEXT NOT NULL
approver VARCHAR(100)
document TEXT
amount VARCHAR(50)
procedure VARCHAR(50)
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
```

### 1.3 Categories (카테고리)
```
categories
---
id UUID PK
name VARCHAR(100) UNIQUE NOT NULL
description TEXT
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
```

### 1.4 Question_Categories (질문-카테고리 관계)
```
question_categories
---
question_id UUID FK >- questions.id
category_id UUID FK >- categories.id
confidence DECIMAL(4,3) NOT NULL
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
PRIMARY KEY (question_id, category_id)
```

### 1.5 Feedback (답변 피드백)
```
feedback
---
id UUID PK
question_id UUID FK >- questions.id
user_id UUID FK >- users.id
is_helpful BOOLEAN NOT NULL
comment TEXT
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
```

## 2. 관계 설명

### 2.1 Users - Questions
- 1:N 관계
- 한 사용자는 여러 개의 질문을 할 수 있음
- 각 질문은 한 명의 사용자에게 속함
- 비로그인 사용자의 경우 user_id는 NULL 허용

### 2.2 Questions - Categories
- M:N 관계
- 하나의 질문은 여러 카테고리에 속할 수 있음
- 하나의 카테고리는 여러 질문을 포함할 수 있음
- question_categories 테이블을 통해 관계 정의
- confidence 필드로 각 카테고리의 신뢰도 저장

### 2.3 Questions - Feedback
- 1:N 관계
- 하나의 질문에 대해 여러 피드백이 있을 수 있음
- 각 피드백은 하나의 질문에 속함

## 3. 인덱스

### 3.1 Questions
```sql
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_at ON questions(created_at);
```

### 3.2 Question_Categories
```sql
CREATE INDEX idx_question_categories_category_id ON question_categories(category_id);
```

### 3.3 Feedback
```sql
CREATE INDEX idx_feedback_question_id ON feedback(question_id);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
```

## 4. 제약 조건

### 4.1 Questions
```sql
ALTER TABLE questions
ADD CONSTRAINT check_confidence
CHECK (confidence >= 0 AND confidence <= 1);
```

### 4.2 Question_Categories
```sql
ALTER TABLE question_categories
ADD CONSTRAINT check_category_confidence
CHECK (confidence >= 0 AND confidence <= 1);
```

## 5. 트리거

### 5.1 Questions Updated_at
```sql
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## 6. 권한 설정 (RLS)

### 6.1 Questions
```sql
-- 읽기: 모든 사용자
CREATE POLICY "모든 사용자가 질문을 볼 수 있음"
ON questions FOR SELECT
USING (true);

-- 생성: 인증된 사용자
CREATE POLICY "인증된 사용자만 질문을 생성할 수 있음"
ON questions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 수정/삭제: 자신의 질문만
CREATE POLICY "자신의 질문만 수정/삭제할 수 있음"
ON questions FOR ALL
USING (auth.uid() = user_id);
```
