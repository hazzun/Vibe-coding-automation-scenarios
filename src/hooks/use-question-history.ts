import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type QuestionHistoryItem = Database['public']['Tables']['question_history']['Row'];
type QuestionHistoryInsert = Database['public']['Tables']['question_history']['Insert'];

export const useQuestionHistory = () => {
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 질문 기록 불러오기
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('question_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문 기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 질문 기록 불러오기
  useEffect(() => {
    fetchHistory();

    // 실시간 업데이트 구독
    const channel = supabase
      .channel('question_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'question_history'
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 새 질문 추가
  const addQuestion = async (question: Omit<QuestionHistoryInsert, 'created_at'>) => {
    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('question_history')
        .insert([question]);

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문을 저장하는데 실패했습니다.');
      throw err;
    }
  };

  // 질문 기록 삭제
  const deleteQuestion = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('question_history')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문을 삭제하는데 실패했습니다.');
      throw err;
    }
  };

  // 모든 질문 기록 삭제
  const clearHistory = async () => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('question_history')
        .delete()
        .neq('id', '0'); // 모든 레코드 삭제

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문 기록을 삭제하는데 실패했습니다.');
      throw err;
    }
  };

  return {
    history,
    isLoading,
    error,
    addQuestion,
    deleteQuestion,
    clearHistory,
    refreshHistory: fetchHistory,
  };
}; 