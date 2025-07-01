import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import QuestionForm from '@/components/QuestionForm';
import AdditionalSelectionForm from '@/components/AdditionalSelectionForm';
import CategoryDisplay from '@/components/CategoryDisplay';
import AnswerDisplay from '@/components/AnswerDisplay';
import QuestionHistory from '@/components/QuestionHistory';
import LoadingOverlay from '@/components/LoadingOverlay';
import { toast } from '@/hooks/use-toast';

interface QuestionHistoryItem {
  id: string;
  question: string;
  category: string;
  timestamp: string;
  confidence: number;
  answer: string;
  approver?: string;
  document?: string;
  webhookResponse?: any;
}

interface ClassificationResult {
  question: string;
  category: string;
  confidence: number;
  timestamp: string;
}

interface CurrentSession {
  question: string;
  category: string;
  confidence: number;
  answer: string;
  timestamp: string;
  approver?: string;
  document?: string;
  amount?: string;
  procedure?: string;
  webhookResponse?: any;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<'question' | 'selection' | 'result'>('question');
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>([]);

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
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 시뮬레이션
      
      const timestamp = new Date().toLocaleString('ko-KR');
      
      let category = '예산 관련 질문';
      let confidence = 0.8;
      
      // 웹훅에서 받은 분류 데이터가 있으면 사용
      if (categoryData) {
        category = categoryData.category || categoryData.keyword || category;
        confidence = categoryData.confidence || confidence;
      }
      
      const classification: ClassificationResult = {
        question,
        category,
        confidence,
        timestamp
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
      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션
      
      const aiResponse = mockAIResponse(
        classificationResult.question, 
        selections.amount, 
        selections.procedure
      );
      
      const session: CurrentSession = {
        question: classificationResult.question,
        category: classificationResult.category,
        confidence: classificationResult.confidence,
        answer: aiResponse.answer,
        timestamp: classificationResult.timestamp,
        amount: selections.amount,
        procedure: selections.procedure,
        webhookResponse: selections.webhookResponse
      };
      
      setCurrentSession(session);
      setCurrentStep('result');
      
      // 질문 기록에 추가
      const historyItem: QuestionHistoryItem = {
        id: Date.now().toString(),
        ...session
      };
      
      setQuestionHistory(prev => [historyItem, ...prev]);
      
      toast({
        title: "최종 답변 생성 완료",
        description: "선택하신 조건에 따른 맞춤 답변이 생성되었습니다.",
      });
      
    } catch (error) {
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
    setCurrentSession(null);
  };

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "피드백 감사합니다" : "피드백이 저장되었습니다",
      description: isPositive 
        ? "긍정적인 피드백이 AI 개선에 도움이 됩니다." 
        : "피드백을 바탕으로 답변 품질을 개선하겠습니다.",
    });
  };

  const handleHistorySelect = (item: QuestionHistoryItem) => {
    const session: CurrentSession = {
      question: item.question,
      category: item.category,
      confidence: item.confidence,
      answer: item.answer,
      timestamp: item.timestamp,
      approver: item.approver,
      document: item.document,
      webhookResponse: item.webhookResponse
    };
    setCurrentSession(session);
    setCurrentStep('result');
  };

  const resetToInitial = () => {
    setCurrentStep('question');
    setClassificationResult(null);
    setCurrentSession(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* 단계별 컨텐츠 */}
          {currentStep === 'question' && (
            <QuestionForm 
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'selection' && classificationResult && (
            <AdditionalSelectionForm
              question={classificationResult.question}
              category={classificationResult.category}
              confidence={classificationResult.confidence}
              onBack={handleBackToQuestion}
              onConfirm={handleSelectionConfirm}
            />
          )}
          
          {currentStep === 'result' && currentSession && (
            <div className="space-y-4 sm:space-y-6">
              <AnswerDisplay
                question={currentSession.question}
                answer={currentSession.answer}
                category={currentSession.category}
                timestamp={currentSession.timestamp}
                webhookResponse={currentSession.webhookResponse}
                onFeedback={handleFeedback}
              />
              <div className="text-center">
                <Button onClick={resetToInitial} variant="outline" className="border-point text-point hover:bg-point hover:text-white">
                  새로운 질문하기
                </Button>
              </div>
            </div>
          )}
          
          {/* 질문 기록 - 메인 화면이나 결과 화면에서만 표시 */}
          {(currentStep === 'question' || currentStep === 'result') && (
            <QuestionHistory
              questions={questionHistory}
              onQuestionSelect={handleHistorySelect}
            />
          )}
        </div>
      </main>

      <LoadingOverlay message={loadingMessage} isVisible={isLoading} />
    </div>
  );
};

export default Index;
