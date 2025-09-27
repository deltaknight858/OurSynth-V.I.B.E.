
import { supabase } from "@/integrations/supabase/client";

export interface DomainOrder {
  id: string;
  user_id: string;
  domain_order: string[];
  created_at: string;
  updated_at: string;
}

export const domainOrderService = {
  async getDomainOrder(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_domain_preferences')
      .select('domain_order')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.domain_order || [];
  },

  async saveDomainOrder(userId: string, domainOrder: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_domain_preferences')
      .upsert({
        user_id: userId,
        domain_order: domainOrder,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      throw error;
    }
  }
};

export default domainOrderService;
