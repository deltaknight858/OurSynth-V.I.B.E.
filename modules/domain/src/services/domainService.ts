import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Domain = Database['public']['Tables']['domains']['Row'];

const domainService = {
  async getDomains(): Promise<Domain[]> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      // Return empty array if not logged in, as RLS will block anyway
      return [];
    }

    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching domains:", error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async purchaseDomain(name: string, years: number): Promise<Domain> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const purchasedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setFullYear(purchasedAt.getFullYear() + years);

    const { data, error } = await supabase
      .from('domains')
      .insert({
        name,
        user_id: user.id,
        purchased_at: purchasedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        status: 'active',
        auto_renew: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error purchasing domain:", error);
      if (error.code === '23505') { // unique constraint violation
        throw new Error(`Domain "${name}" is already taken.`);
      }
      throw new Error(error.message);
    }

    return data;
  },

  async renewDomain(domainId: string, years: number): Promise<Domain> {
    const { data: existingDomain, error: fetchError } = await supabase
      .from('domains')
      .select('expires_at')
      .eq('id', domainId)
      .single();

    if (fetchError || !existingDomain) {
      throw new Error("Domain not found or error fetching it.");
    }

    const currentExpiry = new Date(existingDomain.expires_at);
    const newExpiry = new Date(currentExpiry);
    newExpiry.setFullYear(currentExpiry.getFullYear() + years);

    const { data, error } = await supabase
      .from('domains')
      .update({
        expires_at: newExpiry.toISOString(),
        status: 'active',
      })
      .eq('id', domainId)
      .select()
      .single();

    if (error) {
      console.error("Error renewing domain:", error);
      throw new Error(error.message);
    }

    return data;
  },

  async deleteDomain(domainId: string): Promise<Domain> {
    const { data, error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId)
      .select()
      .single();

    if (error) {
      console.error("Error deleting domain:", error);
      throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Domain not found or you don't have permission to delete it.");
    }

    return data;
  },

  async deleteAllDomains(): Promise<boolean> {
    const { error } = await supabase
      .from('domains')
      .delete()
      .select();

    if (error) throw error;
    return true;
  },
};

export default domainService;
