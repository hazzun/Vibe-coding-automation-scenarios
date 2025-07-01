import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdditionalSelectionFormProps {
  question: string;
  category: string;
  onBack: () => void;
  onConfirm: (selections: { amount: string; procedure: string; webhookResponse?: any }) => void;
  isLoading: boolean;
}

const AdditionalSelectionForm = ({ question, category, onBack, onConfirm, isLoading }: AdditionalSelectionFormProps) => {
  const [amount, setAmount] = useState('');
  const [procedure, setProcedure] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const formatNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const getProcedureInKorean = (value: string): string => {
    const procedureMap: { [key: string]: string } = {
      'additional': '추가경정',
      'early': '조기집행',
      'transfer': '이관',
      'diversion': '전용'
    };
    return procedureMap[value] || value;
  };

  const sendToWebhook = async (amountData: string, procedureData: string) => {
    const webhookUrl = 'https://hook.eu2.make.com/x3h4uviw3qfgwr544qc4qwnj7xyrw75o';
    
    try {
      console.log('=== 웹훅 전송 시작 ===');
      console.log('웹훅 URL:', webhookUrl);
      
      // 전송할 데이터 구조
      const payload = {
        question,
        amount: amountData,
        procedure: getProcedureInKorean(procedureData),
        timestamp: new Date().toISOString(),
        source: 'budget_qa_system',
        category,
        confidence: 80
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

      if (response.ok) {
        const responseText = await response.text();
        console.log('웹훅 응답 텍스트:', responseText);

        try {
          // 응답이 JSON 형식인 경우
          if (responseText && responseText.trim() !== 'Accepted') {
            const parsedResponse = JSON.parse(responseText);
            console.log('파싱된 웹훅 응답:', parsedResponse);
            return {
              결재라인: parsedResponse.결재라인 || '데이터가 없습니다.',
              참고규정항목: parsedResponse.참고규정항목 || '데이터가 없습니다.',
              설명: parsedResponse.설명 || '데이터가 없습니다.'
            };
          }
        } catch (jsonError) {
          console.error('JSON 파싱 오류:', jsonError);
        }

        // JSON이 아니거나 파싱 실패 시 기본 응답
        return {
          결재라인: '데이터가 없습니다.',
          참고규정항목: '데이터가 없습니다.',
          설명: '데이터가 없습니다.'
        };
      }

      throw new Error(`HTTP error! status: ${response.status}`);

    } catch (error) {
      console.error('웹훅 전송 실패:', error);
      return {
        결재라인: '데이터가 없습니다.',
        참고규정항목: '데이터가 없습니다.',
        설명: '데이터가 없습니다.'
      };
    }
  };

  const handleConfirm = async () => {
    if (!amount || !procedure) {
      toast({
        title: "입력 필요",
        description: "예산 금액과 집행 절차를 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLocalLoading(true);
    
    try {
      const amountInWon = (parseInt(amount.replace(/,/g, '')) * 10000).toString();
      const webhookResponse = await sendToWebhook(amountInWon, procedure);
      
      // 웹훅 호출 성공 시 알림
      toast({
        title: "데이터 전송 완료",
        description: "Make.com으로 데이터가 전송되었습니다.",
      });

      onConfirm({ amount: amountInWon, procedure, webhookResponse });
    } catch (error) {
      console.error('handleConfirm 오류:', error);
      toast({
        title: "처리 실패",
        description: "요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
          추가 정보 입력
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          더 정확한 답변을 위해 추가 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        {/* 질문 내용 표시 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            입력하신 질문
          </Label>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{question}</p>
          </div>
        </div>

        {/* 카테고리 표시 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            분류된 카테고리
          </Label>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>

        {/* 예산 금액 입력 */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-foreground">
            예산 금액 (만원 단위)
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              placeholder="예: 1,000 (1천만원)"
              value={amount}
              onChange={handleAmountChange}
              className="text-right pr-12"
              disabled={isLoading || localLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              만원
            </span>
          </div>
        </div>

        {/* 집행 절차 선택 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            집행 절차
          </Label>
          <RadioGroup
            value={procedure}
            onValueChange={setProcedure}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            disabled={isLoading || localLoading}
          >
            <Label
              htmlFor="additional"
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
                ${procedure === 'additional' ? 'border-point bg-point/5' : 'border-input hover:bg-accent'}`}
            >
              <RadioGroupItem value="additional" id="additional" className="text-point" />
              <span>추가경정</span>
            </Label>
            <Label
              htmlFor="early"
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
                ${procedure === 'early' ? 'border-point bg-point/5' : 'border-input hover:bg-accent'}`}
            >
              <RadioGroupItem value="early" id="early" className="text-point" />
              <span>조기집행</span>
            </Label>
            <Label
              htmlFor="transfer"
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
                ${procedure === 'transfer' ? 'border-point bg-point/5' : 'border-input hover:bg-accent'}`}
            >
              <RadioGroupItem value="transfer" id="transfer" className="text-point" />
              <span>이관</span>
            </Label>
            <Label
              htmlFor="diversion"
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors
                ${procedure === 'diversion' ? 'border-point bg-point/5' : 'border-input hover:bg-accent'}`}
            >
              <RadioGroupItem value="diversion" id="diversion" className="text-point" />
              <span>전용</span>
            </Label>
          </RadioGroup>
        </div>

        <Separator />

        {/* 버튼 영역 */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading || localLoading}
            className="text-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전으로
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!amount || !procedure || isLoading || localLoading}
            className="bg-point hover:bg-point/90 text-white"
          >
            {isLoading || localLoading ? '처리중...' : '답변 받기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalSelectionForm;
