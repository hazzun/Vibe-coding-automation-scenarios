import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import QuestionForm from '@/components/QuestionForm';
import AdditionalSelectionForm from '@/components/AdditionalSelectionForm';
import AnswerDisplay from '@/components/AnswerDisplay';
import QuestionHistory from '@/components/QuestionHistory';
import LoadingOverlay from '@/components/LoadingOverlay';
import { toast } from '@/hooks/use-toast';
import { useQuestionHistory } from '@/hooks/use-question-history';
import type { Database } from '@/lib/supabase';

type Question = Database['public']['Tables']['questions']['Row'];

interface ClassificationResult {
  question: string;
  category: string;
  confidence: number;
}

interface CurrentSession extends ClassificationResult {
  answer: string;
  amount?: string;
  procedure?: string;
  webhookResponse?: {
    결재라인: string;
    참고규정항목: string;
    설명: string;
  };
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<'question' | 'selection' | 'result'>('question');
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const { history: questionHistory, addQuestion } = useQuestionHistory();

  // 실제 구현에서는 백엔드 API 호출
  const mockAIResponse = (question: string, amount?: string, procedure?: string) => {
    const categories = [
      '예산 승인 절차',
      '출장비 관리',
      '비품 구매',
      '예산 변경',
      '회계 처리'
    ];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const confidence = 0.7 + Math.random() * 0.3; // 0.7-1.0 사이
    
    const sampleAnswers = {
      '예산 승인 절차': `선택하신 조건에 따른 예산 승인 절차는 다음과 같습니다:

**입력 금액: ${amount || '미입력'}원**
**집행 절차: ${procedure || '미선택'}**

1. **부서별 예산 신청**: 각 부서에서 필요한 예산을 시스템에 입력
2. **1차 검토**: 부서장 승인 (500만원 이하)
3. **2차 검토**: 예산팀 검토 및 승인 (500만원 초과)
4. **최종 승인**: 경영진 승인 (1억원 초과)

승인 기간은 통상 3-5 영업일이 소요되며, 긴급한 경우 별도 절차를 통해 단축 가능합니다.

**집행 절차 "${procedure}"**에 따른 특별 사항:
- 추가경정: 기존 예산 변경 필요
- 조기집행: 조기 집행 사유서 필요
- 이관: 부서 간 예산 이관 승인 필요
- 전용: 과목 간 예산 전용 신청서 필요`,
      
      '출장비 관리': `선택하신 조건에 따른 출장비 관리 절차:

**입력 금액: ${amount || '미입력'}원**
**집행 절차: ${procedure || '미선택'}**

1. **사전 신청**: 출장 3일 전까지 시스템 신청
2. **필요 서류**: 출장신청서, 출장계획서, 견적서
3. **승인권자**: 부서장 승인 필요
4. **지급 한도**: 
   - 국내출장: 1일 15만원
   - 해외출장: 지역별 차등 적용
5. **정산**: 출장 완료 후 7일 이내 영수증 제출

자세한 내용은 내부 규정집을 참조하시기 바랍니다.`,
      
      '비품 구매': `선택하신 조건에 따른 비품 구매 관련 규정:

**입력 금액: ${amount || '미입력'}원**
**집행 절차: ${procedure || '미선택'}**

1. **구매 한도**: 
   - 50만원 이하: 부서장 승인
   - 50만원 초과: 예산팀 승인 필요
2. **구매 절차**: 구매신청 → 견적 비교 → 승인 → 발주
3. **필수 서류**: 구매신청서, 견적서(3개 이상), 사양서
4. **검수**: 물품 도착 후 품질 확인 및 검수보고

IT 장비의 경우 별도의 IT팀 승인이 추가로 필요합니다.`,
      
      '예산 변경': `선택하신 조건에 따른 예산 변경 신청 절차:

**입력 금액: ${amount || '미입력'}원**
**집행 절차: ${procedure || '미선택'}**

1. **신청 시기**: 매월 20일까지 다음달 변경분 신청
2. **변경 한도**: 원 예산의 20% 이내
3. **필요 서류**: 예산변경신청서, 사유서, 계획서
4. **승인 절차**: 부서장 → 예산팀 → 경영진

긴급 변경의 경우 별도 승인 라인을 통해 처리 가능합니다.`,
      
      '회계 처리': `선택하신 조건에 따른 회계 처리 관련 안내:

**입력 금액: ${amount || '미입력'}원**
**집행 절차: ${procedure || '미선택'}**

1. **비용 처리**: 발생주의 원칙에 따라 처리
2. **증빙 서류**: 세금계산서, 계산서, 영수증 필수
3. **처리 기한**: 월말 마감 3일 전까지 제출
4. **계정 과목**: 회계팀 문의 또는 매뉴얼 참조
5. **승인권자**: 회계팀장 최종 승인

부정확한 회계 처리는 감사 시 지적사항이 될 수 있으니 주의하시기 바랍니다.`
    };
    
    return {
      category: randomCategory,
      confidence,
      answer: sampleAnswers[randomCategory as keyof typeof sampleAnswers] || '해당 질문에 대한 답변을 준비 중입니다. 예산팀에 직접 문의해 주세요.'
    };
  };

  const handleQuestionSubmit = async (question: string, categoryData?: any) => {
    setIsLoading(true);
    setLoadingMessage('질문 내용 분석중...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let category = '예산 관련 질문';
      let confidence = 0.8;
      
      if (categoryData) {
        category = categoryData.category || categoryData.keyword || category;
        confidence = categoryData.confidence || confidence;
      }
      
      const classification: ClassificationResult = {
        question,
        category,
        confidence
      };
      
      setClassificationResult(classification);
      setCurrentStep('selection');
      
      toast({
        title: "질문 분류 완료",
        description: "AI가 질문을 분석했습니다. 추가 옵션을 선택해주세요.",
      });
      
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "질문 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSelectionConfirm = async (selections: { amount: string; procedure: string; webhookResponse?: any }) => {
    if (!classificationResult) return;
    
    setIsLoading(true);
    setLoadingMessage('최종 답변 생성중...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const session: CurrentSession = {
        question: classificationResult.question,
        category: classificationResult.category,
        confidence: classificationResult.confidence,
        answer: selections.webhookResponse?.설명 || '',
        amount: selections.amount,
        procedure: selections.procedure,
        webhookResponse: selections.webhookResponse
      };

      // 데이터베이스에 질문 저장
      await addQuestion({
        question: session.question,
        category: session.category,
        confidence: session.confidence,
        answer: JSON.stringify(session.webhookResponse),
        amount: session.amount || null,
        procedure: session.procedure || null,
        approver: session.webhookResponse?.결재라인 || null,
        document: session.webhookResponse?.참고규정항목 || null,
        user_id: null
      });
      
      setCurrentSession(session);
      setCurrentStep('result');
      
      toast({
        title: "답변 생성 완료",
        description: "AI가 답변을 생성했습니다.",
      });
      
    } catch (error) {
      console.error('Error in handleSelectionConfirm:', error);
      toast({
        title: "오류 발생",
        description: "답변 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleBackToQuestion = () => {
    setCurrentStep('question');
    setClassificationResult(null);
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
  };

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "긍정적인 피드백" : "부정적인 피드백",
      description: isPositive ? "답변이 도움이 되었다니 기쁩니다." : "더 나은 답변을 제공하도록 하겠습니다.",
    });
  };

  const handleHistorySelect = (item: Question) => {
    let webhookResponse;
    try {
      webhookResponse = JSON.parse(item.answer);
    } catch (e) {
      webhookResponse = {
        결재라인: item.approver || '데이터가 없습니다.',
        참고규정항목: item.document || '데이터가 없습니다.',
        설명: item.answer || '데이터가 없습니다.'
      };
    }

    const session: CurrentSession = {
      question: item.question,
      category: item.category,
      confidence: item.confidence,
      answer: item.answer,
      amount: item.amount || undefined,
      procedure: item.procedure || undefined,
      webhookResponse
    };
    
    setCurrentSession(session);
    setCurrentStep('result');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Header />
      
      {isLoading && <LoadingOverlay isLoading={isLoading} message={loadingMessage} />}

      <div className="space-y-8">
        {currentStep === 'question' && (
          <>
            <QuestionForm onSubmit={handleQuestionSubmit} isLoading={isLoading} />
            <QuestionHistory questions={questionHistory} onQuestionSelect={handleHistorySelect} />
          </>
        )}

        {currentStep === 'selection' && classificationResult && (
          <AdditionalSelectionForm
            question={classificationResult.question}
            category={classificationResult.category}
            onBack={handleBackToQuestion}
            onConfirm={handleSelectionConfirm}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'result' && currentSession && (
          <AnswerDisplay
            question={currentSession.question}
            answer={currentSession.answer}
            category={currentSession.category}
            webhookResponse={currentSession.webhookResponse}
            onBack={handleBackToSelection}
            onFeedback={handleFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
