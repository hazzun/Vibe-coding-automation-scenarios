
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, FileText, User, CheckCircle } from 'lucide-react';

interface CategoryDisplayProps {
  category: string;
  confidence: number;
  approverOptions?: string[];
  documentOptions?: string[];
  onApproverChange?: (value: string) => void;
  onDocumentChange?: (value: string) => void;
}

const CategoryDisplay = ({ 
  category, 
  confidence, 
  approverOptions = [], 
  documentOptions = [],
  onApproverChange,
  onDocumentChange
}: CategoryDisplayProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '높음';
    if (confidence >= 0.6) return '보통';
    return '낮음';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          질문 분류 결과
        </CardTitle>
        <CardDescription>
          AI가 질문을 분석하여 적절한 카테고리로 분류했습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium text-foreground">분류 결과: </span>
              <span className="text-lg font-semibold text-primary">{category}</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getConfidenceColor(confidence)}
          >
            신뢰도: {getConfidenceText(confidence)} ({Math.round(confidence * 100)}%)
          </Badge>
        </div>

        {(approverOptions.length > 0 || documentOptions.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approverOptions.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="h-4 w-4" />
                  승인자 유형
                </label>
                <Select onValueChange={onApproverChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="승인자 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {approverOptions.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {documentOptions.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4" />
                  문서 유형
                </label>
                <Select onValueChange={onDocumentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="문서 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentOptions.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDisplay;
