import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircleQuestion } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuestionFormProps {
  onSubmit: (question: string, categoryData?: any) => void;
  isLoading: boolean;
}

const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
  const [question, setQuestion] = useState('');

  const sendToWebhook = async (questionData: string) => {
    const webhookUrl = 'https://hook.eu2.make.com/c1wk1uaqbcchjpkfyhkpsufo8f52yaeh';
    
    try {
      console.log('Sending question to webhook:', questionData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionData,
          timestamp: new Date().toISOString(),
          source: 'budget_qa_system'
        }),
      });

      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답을 먼저 텍스트로 받은 후 JSON 파싱 시도
      const responseText = await response.text();
      console.log('Webhook response text:', responseText);

      let responseData;
      try {
        // JSON 파싱 시도
        responseData = JSON.parse(responseText);
        console.log('Parsed JSON response:', responseData);
      } catch (jsonError) {
        // JSON이 아닌 경우 텍스트를 카테고리로 사용
        console.log('Response is not JSON, using as category:', responseText);
        responseData = {
          category: responseText.trim(),
          confidence: 0.8
        };
      }

      toast({
        title: "질문 전송 완료",
        description: "질문이 성공적으로 전송되었습니다.",
      });

      return responseData;

    } catch (error) {
      console.error('Webhook error:', error);
      toast({
        title: "전송 실패",
        description: "질문 전송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      try {
        const categoryData = await sendToWebhook(question.trim());
        onSubmit(question.trim(), categoryData);
        setQuestion('');
      } catch (error) {
        // 웹훅 전송 실패해도 UI는 계속 진행
        onSubmit(question.trim());
        setQuestion('');
      }
    }
  };

  const exampleQuestions = [
    "부서에서 복리후생비로 직원 생일 선물 예산 300만 원을 잡으려고 하는데, 어느 정도 결재를 받아야 하나요?",
    "업무용 노트북 구입비 1억 2000만 원을 추가경정으로 반영하려고 합니다. 어떤 절차와 결재자가 필요한가요?",
    "부서 해외 출장비로 5억 6000만 원이 추가로 필요합니다.결재라인이 어떻게 되나요??",
    "연구비에서 AI 교육 프로그램 외부 강사료로 800만 원을 지출하려면 어떤 결재 라인을 따라야 하나요?"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <MessageCircleQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
          <span className="text-point">예산 규정 질문하기</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          예산 관련 궁금한 점을 자유롭게 입력해주세요. AI가 정확한 답변을 제공해드립니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium text-foreground">
              질문 입력
            </label>
            <Textarea
              id="question"
              placeholder="예: 부서별 예산 승인 절차가 어떻게 되나요?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] resize-none focus:ring-point focus:border-point text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className="w-full bg-point hover:bg-point/90 text-white text-sm sm:text-base py-2 sm:py-3"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                분석 중...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                질문하기
              </>
            )}
          </Button>
        </form>

        <div className="border-t pt-4 sm:pt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">자주 묻는 질문 예시</h3>
          <div className="grid grid-cols-1 gap-2">
            {exampleQuestions.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuestion(example)}
                className="text-left p-3 text-xs sm:text-sm text-muted-foreground hover:text-point hover:bg-accent rounded-md transition-colors border-l-2 border-transparent hover:border-point"
                disabled={isLoading}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
