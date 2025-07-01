import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      question_history: {
        Row: {
          id: string;
          created_at: string;
          question: string;
          category: string;
          confidence: number;
          answer: string;
          approver?: string;
          document?: string;
          amount?: string;
          procedure?: string;
          user_id?: string;
        };
        Insert: Omit<Database['public']['Tables']['question_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['question_history']['Insert']>;
      };
    };
  };
}; 