
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bot, ThumbsUp, ThumbsDown, Copy, CheckCircle, User, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  category: string;
  timestamp: string;
  webhookResponse?: any;
  onFeedback?: (isPositive: boolean) => void;
}

const AnswerDisplay = ({ question, answer, category, timestamp, webhookResponse, onFeedback }: AnswerDisplayProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      toast({
        title: "복사 완료",
        description: "답변이 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "답변 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const renderApprovalLine = (approvalLine: string) => {
    if (!approvalLine) return null;

    const approvers = approvalLine.split(',').map(s => s.trim()).filter(Boolean);
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {approvers.map((approver, index) => (
          <React.Fragment key={index}>
            <div className="px-2 sm:px-3 py-1 sm:py-2 bg-point/10 text-point rounded-lg font-medium text-sm sm:text-base">
              {approver}
            </div>
            {index < approvers.length - 1 && (
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderWebhookResponse = () => {
    if (!webhookResponse) return null;

    // JSON 구조의 응답인 경우
    if (webhookResponse.결재라인 || webhookResponse.필요한절차 || webhookResponse.참고규정항목 || webhookResponse.설명) {
      return (
        <Card className="mt-4 sm:mt-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
              <span className="text-point">답변</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              질문 내용을 AI를 통해 분석한 결재라인 정보입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {/* 결재라인 UI */}
            {webhookResponse.결재라인 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-point flex items-center gap-2 text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-point"></div>
                  결재라인
                </h4>
                <div className="p-3 sm:p-4 bg-point/5 border border-point/20 rounded-lg">
                  {renderApprovalLine(webhookResponse.결재라인)}
                </div>
              </div>
            )}

            {/* 기타 응답 정보 */}
            <div className="space-y-3 sm:space-y-4">
              {webhookResponse.필요한절차 && (
                <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-800 block mb-2 text-sm sm:text-base">필요한 절차</span>
                  <span className="text-gray-700 text-sm sm:text-base">{webhookResponse.필요한절차}</span>
                </div>
              )}
              
              {webhookResponse.참고규정항목 && (
                <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-800 block mb-2 text-sm sm:text-base">참고 규정 항목</span>
                  <span className="text-gray-700 text-sm sm:text-base">{webhookResponse.참고규정항목}</span>
                </div>
              )}
              
              {webhookResponse.설명 && (
                <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-800 block mb-2 text-sm sm:text-base">상세 설명</span>
                  <span className="text-gray-700 leading-relaxed text-sm sm:text-base">{webhookResponse.설명}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // 텍스트 응답인 경우
    if (webhookResponse.text) {
      return (
        <Card className="mt-4 sm:mt-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
              <span className="text-point">답변</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-gray-700 text-sm sm:text-base">{webhookResponse.text}</p>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* 웹훅 응답 정보 영역 */}
      {renderWebhookResponse()}

      {/* 피드백 및 복사 버튼 */}
      <Card>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm text-muted-foreground">이 답변이 도움이 되었나요?</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback?.(true)}
                  className="flex items-center gap-1 border-point text-point hover:bg-point hover:text-white text-xs sm:text-sm"
                >
                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  도움됨
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback?.(false)}
                  className="flex items-center gap-1 text-xs sm:text-sm"
                >
                  <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  아니요
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-1 border-point text-point hover:bg-point hover:text-white text-xs sm:text-sm"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              답변 복사
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnswerDisplay;
