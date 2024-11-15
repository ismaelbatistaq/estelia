export type UserType = 'platform_admin' | 'platform_agent' | 'business_user';
export type BusinessRole = 'owner' | 'admin' | 'manager' | 'staff' | 'stylist' | 'receptionist';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          user_type: UserType;
          business_id: string | null;
          role: BusinessRole | null;
          platform_role: string | null;
          is_owner: boolean;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          user_type: UserType;
          business_id?: string | null;
          role?: BusinessRole | null;
          platform_role?: string | null;
          is_owner?: boolean;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          user_type?: UserType;
          business_id?: string | null;
          role?: BusinessRole | null;
          platform_role?: string | null;
          is_owner?: boolean;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... rest of the types remain the same
    };
  };
}