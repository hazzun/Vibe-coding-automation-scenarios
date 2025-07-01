import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

export const useQuestionHistory = () => {
  const [history, setHistory] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 질문 기록 불러오기
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('questions')
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
      .channel('questions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'questions'
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
  const addQuestion = async (question: QuestionInsert) => {
    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('questions')
        .insert([question]);

      if (insertError) throw insertError;
      
      // 성공적으로 추가된 후 목록 새로고침
      await fetchHistory();
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
        .from('questions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // 성공적으로 삭제된 후 목록 새로고침
      await fetchHistory();
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
        .from('questions')
        .delete()
        .neq('id', '0'); // 모든 레코드 삭제

      if (deleteError) throw deleteError;
      
      // 성공적으로 삭제된 후 목록 새로고침
      await fetchHistory();
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