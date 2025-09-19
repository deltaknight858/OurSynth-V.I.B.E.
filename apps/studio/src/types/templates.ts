export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  tags?: string[];
  category?: string;
  price: number;
  rating: number;
  downloads_count: number;
  author_id: string;
  is_featured: boolean;
  is_active: boolean;
  component_data: any; // The actual template configuration
  created_at?: string;
  updated_at?: string;
}
