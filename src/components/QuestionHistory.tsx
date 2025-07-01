
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, MessageCircle, Clock, ArrowRight } from 'lucide-react';

interface QuestionHistoryItem {
  id: string;
  question: string;
  category: string;
  timestamp: string;
  confidence: number;
}

interface QuestionHistoryProps {
  questions: QuestionHistoryItem[];
  onQuestionSelect?: (question: QuestionHistoryItem) => void;
}

const QuestionHistory = ({ questions, onQuestionSelect }: QuestionHistoryProps) => {
  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            질문 기록
          </CardTitle>
          <CardDescription>
            아직 질문 기록이 없습니다. 첫 번째 질문을 입력해보세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          질문 기록
        </CardTitle>
        <CardDescription>
          최근 질문한 내용들을 확인하고 다시 볼 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {questions.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onQuestionSelect?.(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {item.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <span>신뢰도: {Math.round(item.confidence * 100)}%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuestionHistory;
