export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          id: number
          meta: Json | null
          name: string
          path: string | null
          product_slug: string | null
          session_id: string
          value_mxn: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          meta?: Json | null
          name: string
          path?: string | null
          product_slug?: string | null
          session_id: string
          value_mxn?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          meta?: Json | null
          name?: string
          path?: string | null
          product_slug?: string | null
          session_id?: string
          value_mxn?: number | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          admin_notification_email: string | null
          id: number
          send_customer_email: boolean
          updated_at: string
        }
        Insert: {
          admin_notification_email?: string | null
          id?: number
          send_customer_email?: boolean
          updated_at?: string
        }
        Update: {
          admin_notification_email?: string | null
          id?: number
          send_customer_email?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          cart_token: string | null
          converted_order_id: string | null
          created_at: string
          customer_name: string | null
          email: string | null
          id: string
          items: Json
          last_seen_at: string
          phone: string | null
          status: string
          subtotal_mxn: number
          updated_at: string
        }
        Insert: {
          cart_token?: string | null
          converted_order_id?: string | null
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          items?: Json
          last_seen_at?: string
          phone?: string | null
          status?: string
          subtotal_mxn?: number
          updated_at?: string
        }
        Update: {
          cart_token?: string | null
          converted_order_id?: string | null
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          items?: Json
          last_seen_at?: string
          phone?: string | null
          status?: string
          subtotal_mxn?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          event: string
          id: string
          order_id: string
          payload: Json | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          order_id: string
          payload?: Json | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          order_id?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          dose: string
          id: string
          line_total_mxn: number
          order_id: string
          product_name: string
          product_slug: string
          qty: number
          unit_price_mxn: number
        }
        Insert: {
          dose: string
          id?: string
          line_total_mxn: number
          order_id: string
          product_name: string
          product_slug: string
          qty: number
          unit_price_mxn: number
        }
        Update: {
          dose?: string
          id?: string
          line_total_mxn?: number
          order_id?: string
          product_name?: string
          product_slug?: string
          qty?: number
          unit_price_mxn?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          carrier: string | null
          cart_id: string | null
          created_at: string
          customer_address: Json
          customer_email: string
          customer_name: string
          customer_phone: string
          external_reference: string | null
          id: string
          mp_payment_id: string | null
          mp_preference_id: string | null
          mp_status_detail: string | null
          notes: string | null
          notified_at: string | null
          shipped_at: string | null
          shipping_status: string
          status: string
          total_mxn: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          carrier?: string | null
          cart_id?: string | null
          created_at?: string
          customer_address: Json
          customer_email: string
          customer_name: string
          customer_phone: string
          external_reference?: string | null
          id?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          mp_status_detail?: string | null
          notes?: string | null
          notified_at?: string | null
          shipped_at?: string | null
          shipping_status?: string
          status?: string
          total_mxn: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          carrier?: string | null
          cart_id?: string | null
          created_at?: string
          customer_address?: Json
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          external_reference?: string | null
          id?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          mp_status_detail?: string | null
          notes?: string | null
          notified_at?: string | null
          shipped_at?: string | null
          shipping_status?: string
          status?: string
          total_mxn?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          created_at: string
          device: string | null
          id: number
          path: string
          referrer_host: string | null
          session_id: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          id?: number
          path: string
          referrer_host?: string | null
          session_id: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          id?: number
          path?: string
          referrer_host?: string | null
          session_id?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_analytics: { Args: { _days?: number }; Returns: Json }
      admin_dashboard_summary: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      track_event: {
        Args: {
          _meta: Json
          _name: string
          _path: string
          _product_slug: string
          _session: string
          _value_mxn: number
        }
        Returns: undefined
      }
      track_pageview: {
        Args: {
          _device: string
          _path: string
          _referrer: string
          _session: string
          _user_agent: string
          _utm_campaign: string
          _utm_medium: string
          _utm_source: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
