import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, CheckCircle, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  category: string;
  webhookResponse?: {
    결재라인: string;
    참고규정항목: string;
    설명: string;
  };
  onBack: () => void;
  onFeedback: (isPositive: boolean) => void;
}

const AnswerDisplay = ({
  question,
  answer,
  category,
  webhookResponse: initialWebhookResponse,
  onBack,
  onFeedback,
}: AnswerDisplayProps) => {
  // answer가 JSON 문자열인 경우 파싱
  const webhookResponse = initialWebhookResponse || (() => {
    try {
      return JSON.parse(answer);
    } catch (e) {
      return {
        결재라인: '데이터가 없습니다.',
        참고규정항목: '데이터가 없습니다.',
        설명: answer || '데이터가 없습니다.'
      };
    }
  })();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 답변 카드 */}
      <Card className="border-2 border-point">
        <CardContent className="p-6 space-y-4">
          {/* 답변 헤더 */}
          <div className="flex items-center gap-2 text-xl font-medium text-point">
            <CheckCircle className="h-6 w-6" />
            <span>답변</span>
          </div>
          
          <p className="text-gray-600 text-sm">
            질문 내용을 AI를 통해 분석한 결과입니다
          </p>

          {/* 결재라인 */}
          <div className="space-y-2">
            <h3 className="text-point font-medium">• 결재라인</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {webhookResponse?.결재라인 || '데이터가 없습니다.'}
              </p>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">상세 설명</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {webhookResponse?.설명 || '데이터가 없습니다.'}
              </p>
            </div>
          </div>

          {/* 참고 규정 */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">참고 규정</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {webhookResponse?.참고규정항목 || '데이터가 없습니다.'}
              </p>
            </div>
          </div>

          {/* 피드백 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFeedback(true)}
              className="text-green-600 hover:text-green-700"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              도움됨
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFeedback(false)}
              className="text-red-600 hover:text-red-700"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              도움안됨
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 뒤로가기 버튼 */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-point hover:text-point/90"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          다시 질문하기
        </Button>
      </div>
    </div>
  );
};

export default AnswerDisplay;
