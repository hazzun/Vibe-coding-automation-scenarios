import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdditionalSelectionFormProps {
  question: string;
  category: string;
  confidence: number;
  onBack: () => void;
  onConfirm: (selections: { amount: string; procedure: string; webhookResponse?: any }) => void;
}

const AdditionalSelectionForm = ({ question, category, confidence, onBack, onConfirm }: AdditionalSelectionFormProps) => {
  const [amount, setAmount] = useState('');
  const [procedure, setProcedure] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const sendToWebhook = async (questionData: string, amountData: string, procedureData: string) => {
    const webhookUrl = 'https://hook.eu2.make.com/x3h4uviw3qfgwr544qc4qwnj7xyrw75o';
    
    try {
      console.log('=== 웹훅 전송 시작 ===');
      console.log('웹훅 URL:', webhookUrl);
      
      // 전송할 데이터 구조 개선
      const payload = {
        question: questionData,
        amount: parseInt(amountData).toString(), // 숫자로 변환 후 문자열로
        procedure: procedureData,
        timestamp: new Date().toISOString(),
        source: 'budget_qa_system',
        category: category,
        confidence: Math.round(confidence * 100)
      };
      
      console.log('전송 데이터:', payload);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      console.log('웹훅 응답 상태:', response.status);
      console.log('웹훅 응답 헤더:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답 처리
      const responseText = await response.text();
      console.log('웹훅 응답 텍스트:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('파싱된 JSON 응답:', responseData);
      } catch (jsonError) {
        console.log('JSON 파싱 실패, 텍스트를 그대로 사용:', responseText);
        responseData = {
          success: true,
          data: responseText.trim(),
          timestamp: new Date().toISOString()
        };
      }

      console.log('=== 웹훅 전송 성공 ===');
      toast({
        title: "데이터 전송 완료",
        description: "추가 정보가 성공적으로 전송되었습니다.",
      });

      return responseData;

    } catch (error) {
      console.error('=== 웹훅 전송 실패 ===');
      console.error('오류 상세:', error);
      console.error('오류 메시지:', error instanceof Error ? error.message : '알 수 없는 오류');
      console.error('오류 스택:', error instanceof Error ? error.stack : 'No stack trace');
      
      toast({
        title: "전송 실패",
        description: `데이터 전송 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const handleConfirm = async () => {
    console.log('=== 최종 답변 받기 클릭 ===');
    console.log('현재 입력값:', { amount, procedure });
    
    if (!amount || !procedure) {
      console.log('입력값 부족:', { amount: !!amount, procedure: !!procedure });
      toast({
        title: "입력 필요",
        description: "예산 금액과 집행 절차를 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('원 단위 변환 전 금액:', amount);
      const amountInWon = (parseInt(amount.replace(/,/g, '')) * 10000).toString();
      console.log('원 단위 변환 후 금액:', amountInWon);
      
      const webhookResponse = await sendToWebhook(question, amountInWon, procedure);
      
      console.log('onConfirm 호출 준비:', {
        amount: amountInWon,
        procedure,
        webhookResponse
      });
      
      onConfirm({ 
        amount: amountInWon, 
        procedure, 
        webhookResponse 
      });
      
      console.log('=== 최종 답변 받기 완료 ===');
      
    } catch (error) {
      console.error('handleConfirm 오류:', error);
      // 웹훅 실패 시에도 UI 진행은 계속하지 않음
      toast({
        title: "처리 실패",
        description: "요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* 상단 이전으로 버튼 */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="border-point text-point hover:bg-point hover:text-white text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          이전으로
        </Button>
      </div>

      {/* 질문 분류 결과 */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            질문 분류 완료
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            AI가 질문을 분석했습니다. 더 정확한 답변을 위해 추가 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <span className="font-medium text-foreground block mb-1 sm:mb-2 text-sm sm:text-base">입력하신 질문</span>
              <span className="text-muted-foreground text-sm sm:text-base">{question}</span>
            </div>
            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-medium text-blue-900 block mb-1 text-sm sm:text-base">분류된 카테고리</span>
              <div className="flex items-baseline gap-2">
                <span className="text-blue-700 text-sm sm:text-base font-medium">{category}</span>
                <span className="text-blue-600 text-xs sm:text-sm">(신뢰도 {Math.round(confidence * 100)}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추가 정보 입력 */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
            <span className="text-point">추가 정보 입력</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            더 정확한 답변을 위해 예산 금액과 집행 절차를 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-foreground">
                예산 금액
              </label>
              <Input
                id="amount"
                type="text"
                placeholder="만원"
                value={amount}
                onChange={handleAmountChange}
                className="focus:ring-point focus:border-point text-sm sm:text-base"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                만원 단위로 입력해주세요. (예: 300만원 → 300 입력)
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                집행 절차
              </label>
              <RadioGroup value={procedure} onValueChange={setProcedure} disabled={isLoading} className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="추가경정" id="추가경정" className="border-point text-point" />
                  <Label htmlFor="추가경정" className="text-sm cursor-pointer">추가경정</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="조기집행" id="조기집행" className="border-point text-point" />
                  <Label htmlFor="조기집행" className="text-sm cursor-pointer">조기집행</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="이관" id="이관" className="border-point text-point" />
                  <Label htmlFor="이관" className="text-sm cursor-pointer">이관</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="전용" id="전용" className="border-point text-point" />
                  <Label htmlFor="전용" className="text-sm cursor-pointer">전용</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Separator />

          <div className="flex justify-center">
            <Button
              onClick={handleConfirm}
              disabled={!amount || !procedure || isLoading}
              className="w-full sm:w-auto bg-point hover:bg-point/90 text-white text-sm sm:text-base py-2 sm:py-3 px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  최종 답변 받기
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalSelectionForm;
