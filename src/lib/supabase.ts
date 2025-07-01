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
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          last_sign_in_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          user_id: string | null;
          question: string;
          category: string;
          confidence: number;
          answer: string;
          approver: string | null;
          document: string | null;
          amount: string | null;
          procedure: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      question_categories: {
        Row: {
          question_id: string;
          category_id: string;
          confidence: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['question_categories']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['question_categories']['Insert']>;
      };
      feedback: {
        Row: {
          id: string;
          question_id: string | null;
          user_id: string | null;
          is_helpful: boolean;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feedback']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['feedback']['Insert']>;
      };
    };
  };
}; 