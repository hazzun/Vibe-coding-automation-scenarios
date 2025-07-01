import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AnswerDisplayProps {
  webhookResponse?: {
    결재라인: string;
    참고규정항목: string;
    설명: string;
  };
  onBack: () => void;
  onFeedback: (isPositive: boolean) => void;
}

const AnswerDisplay = ({
  webhookResponse,
  onBack,
  onFeedback,
}: AnswerDisplayProps) => {
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
        </CardContent>
      </Card>

      {/* 피드백 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">이 답변이 도움이 되었나요?</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onFeedback(true)}
              className="border-point text-point hover:bg-point/5"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              도움됨
            </Button>
            <Button
              variant="outline"
              onClick={() => onFeedback(false)}
              className="text-gray-500 hover:bg-gray-50"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              아니요
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-gray-500"
          >
            새로운 질문하기
          </Button>
          <Button
            variant="outline"
            className="text-point border-point hover:bg-point/5"
            onClick={() => window.print()}
          >
            답변 복사
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;
