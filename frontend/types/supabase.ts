export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          avatarUrl: string | null;
          created_at: string | null;
          id: number;
          portfolio: string | null;
          tries: number;
          username: string;
        };
        Insert: {
          avatarUrl?: string | null;
          created_at?: string | null;
          id?: number;
          portfolio?: string | null;
          tries?: number;
          username: string;
        };
        Update: {
          avatarUrl?: string | null;
          created_at?: string | null;
          id?: number;
          portfolio?: string | null;
          tries?: number;
          username?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
