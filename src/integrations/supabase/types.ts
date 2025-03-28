export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_level:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at: string
          expiry_date: string | null
          id: string
          issue_date: string
          issuer: string
          media_url: string | null
          metadata: Json | null
          points_awarded: number
          student_id: string
          title: string
          verification_hash: string | null
        }
        Insert: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuer: string
          media_url?: string | null
          metadata?: Json | null
          points_awarded?: number
          student_id: string
          title: string
          verification_hash?: string | null
        }
        Update: {
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issuer?: string
          media_url?: string | null
          metadata?: Json | null
          points_awarded?: number
          student_id?: string
          title?: string
          verification_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "user_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "user_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          created_at: string
          id: string
          name: string
          university_code: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          university_code: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          university_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "colleges_university_code_fkey"
            columns: ["university_code"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["code"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          media_urls: string[] | null
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          banner_url: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          is_private: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          member_id: string
          role: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          member_id: string
          role: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          member_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          attendee_id: string
          event_id: string
          id: string
          registered_at: string
          status: string
        }
        Insert: {
          attendee_id: string
          event_id: string
          id?: string
          registered_at?: string
          status: string
        }
        Update: {
          attendee_id?: string
          event_id?: string
          id?: string
          registered_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          community_id: string | null
          created_at: string
          date: string
          description: string | null
          end_date: string | null
          host_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          community_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          end_date?: string | null
          host_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          community_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          end_date?: string | null
          host_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chat_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          member_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          member_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chat_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chat_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          media_urls: string[] | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          media_urls?: string[] | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          media_urls?: string[] | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chats: {
        Row: {
          community_id: string | null
          created_at: string
          creator_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          community_id?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          community_id?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_chats_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chats_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          id: string
          institution: string | null
          institution_rank: number | null
          last_updated: string
          overall_rank: number | null
          student_id: string
          total_points: number
        }
        Insert: {
          id?: string
          institution?: string | null
          institution_rank?: number | null
          last_updated?: string
          overall_rank?: number | null
          student_id: string
          total_points?: number
        }
        Update: {
          id?: string
          institution?: string | null
          institution_rank?: number | null
          last_updated?: string
          overall_rank?: number | null
          student_id?: string
          total_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          media_urls: string[] | null
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          related_id: string | null
          sender_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          related_id?: string | null
          sender_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          related_id?: string | null
          sender_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      point_rules: {
        Row: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_level:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at: string
          id: string
          points: number
        }
        Insert: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          id?: string
          points: number
        }
        Update: {
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          id?: string
          points?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          comments_count: number | null
          community_id: string | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          media_urls: string[] | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          community_id?: string | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          community_id?: string | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          college: string | null
          display_name: string
          email: string
          id: string
          institution: string | null
          joined_at: string
          role: Database["public"]["Enums"]["user_role"]
          total_points: number
          university: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          display_name: string
          email: string
          id: string
          institution?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          total_points?: number
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          display_name?: string
          email?: string
          id?: string
          institution?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["user_role"]
          total_points?: number
          university?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      universities: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_chats: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          language: string
          notifications: Json
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          notifications?: Json
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          notifications?: Json
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_message_read_only_update: {
        Args: {
          content_old: string
          content_new: string
          media_urls_old: string[]
          media_urls_new: string[]
        }
        Returns: boolean
      }
      get_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_or_create_direct_chat: {
        Args: {
          user1_id: string
          user2_id: string
        }
        Returns: string
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_community_admin: {
        Args: {
          community_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      is_group_chat_member: {
        Args: {
          group_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      update_leaderboard_ranks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      certificate_type: "course" | "competition" | "other"
      competition_level: "college" | "state" | "national" | "international"
      user_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
