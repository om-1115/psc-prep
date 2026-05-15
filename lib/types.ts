// Shared TypeScript types that mirror the Supabase database schema

export interface DbExam {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DbSubject {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface DbTopic {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DbPaper {
  id: string;
  exam_id: string;
  year: number;
  title: string;
  paper_code: string | null;
  total_questions: number | null;
  total_marks: number | null;
  created_at: string;
}

export interface DbOption {
  id: string;
  question_id: string;
  option_key: string;
  option_text: string;
}

export interface DbQuestion {
  id: string;
  question_text: string;
  paper_id: string | null;
  topic_id: string;
  correct_option_id: string | null;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
