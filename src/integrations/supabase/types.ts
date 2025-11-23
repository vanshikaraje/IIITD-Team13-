export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
      orders: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          order_type: Database["public"]["Enums"]["order_type"];
          status: Database["public"]["Enums"]["order_status"];
          prescription_url: string | null;
          patient_details: Json | null;
          doctor_notes: string | null;
          fee_amount: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          order_type: Database["public"]["Enums"]["order_type"];
          status?: Database["public"]["Enums"]["order_status"];
          prescription_url?: string | null;
          patient_details?: Json | null;
          doctor_notes?: string | null;
          fee_amount?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          order_type?: Database["public"]["Enums"]["order_type"];
          status?: Database["public"]["Enums"]["order_status"];
          prescription_url?: string | null;
          patient_details?: Json | null;
          doctor_notes?: string | null;
          fee_amount?: number | null;
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
      order_type: "MEDICINE_DELIVERY" | "TELE_CONSULTATION" | "HOME_VISIT";
      order_status: "pending" | "verified" | "in_progress" | "completed" | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};