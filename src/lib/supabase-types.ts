export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
          organization_id: string
          preferences: Json | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          organization_id: string
          preferences?: Json | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string
          preferences?: Json | null
          notes?: string | null
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration: number
          price: number
          category: string
          created_at: string
          updated_at: string
          organization_id: string
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration: number
          price: number
          category: string
          created_at?: string
          updated_at?: string
          organization_id: string
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          category?: string
          created_at?: string
          updated_at?: string
          organization_id?: string
          image_url?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          service_id: string
          stylist_id: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
          organization_id: string
        }
        Insert: {
          id?: string
          client_id: string
          service_id: string
          stylist_id: string
          start_time: string
          end_time: string
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          organization_id: string
        }
        Update: {
          id?: string
          client_id?: string
          service_id?: string
          stylist_id?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          category: string
          created_at: string
          updated_at: string
          organization_id: string
          image_url: string | null
          sku: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock: number
          category: string
          created_at?: string
          updated_at?: string
          organization_id: string
          image_url?: string | null
          sku: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          category?: string
          created_at?: string
          updated_at?: string
          organization_id?: string
          image_url?: string | null
          sku?: string
        }
      }
      sales: {
        Row: {
          id: string
          client_id: string | null
          total: number
          status: string
          payment_method: string
          created_at: string
          updated_at: string
          organization_id: string
          invoice_number: string
          tax: number
        }
        Insert: {
          id?: string
          client_id?: string | null
          total: number
          status: string
          payment_method: string
          created_at?: string
          updated_at?: string
          organization_id: string
          invoice_number: string
          tax: number
        }
        Update: {
          id?: string
          client_id?: string | null
          total?: number
          status?: string
          payment_method?: string
          created_at?: string
          updated_at?: string
          organization_id?: string
          invoice_number?: string
          tax?: number
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string | null
          service_id: string | null
          quantity: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sale_id: string
          product_id?: string | null
          service_id?: string | null
          quantity: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string | null
          service_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          organization_id: string
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          organization_id: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          organization_id?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
    }
  }
}