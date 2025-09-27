
import { createBrowserClient } from "@supabase/ssr";
import { UserProfile, authService } from "./authService";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return authService.getUserProfile(userId);
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "email">>
  ): Promise<UserProfile> {
    const validUpdates: Partial<UserProfile> = {};
    if (updates.full_name !== undefined) {
      validUpdates.full_name = updates.full_name;
    }
    if (updates.avatar_url !== undefined) {
      validUpdates.avatar_url = updates.avatar_url;
    }

    return authService.updateUserProfile(userId, validUpdates);
  },

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true, 
        });

      if (uploadError) throw uploadError;
      if (!data) throw new Error("File upload failed, no path returned.");

      const { data: { publicUrl } } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(data.path);

      if (!publicUrl) {
        throw new Error("Could not get public URL for profile picture.");
      }
      
      await this.updateUserProfile(userId, { avatar_url: publicUrl });
      return publicUrl;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },

  async searchUsers(query: string): Promise<UserProfile[]> {
    if (!query.trim()) {
      return [];
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    return data as UserProfile[];
  },

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("full_name", username)
      .maybeSingle();

    if (error) {
      console.error("Error checking username:", error);
      return false;
    }
    return !data;
  },
};
