import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import type { Database } from '@/lib/supabase';

type Question = Database['public']['Tables']['questions']['Row'];

interface QuestionHistoryProps {
  questions: Question[];
  onQuestionSelect?: (question: Question) => void;
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
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <History className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
          최근 질문 내역
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          이전에 문의하신 내용을 다시 확인할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {questions.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-border rounded-lg hover:bg-point/5 transition-colors cursor-pointer"
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
                        {new Date(item.created_at).toLocaleString()}
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
