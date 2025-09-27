import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { UserProfile, authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Camera, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { user, profile, loading, signOut, sendPasswordResetEmail, resendVerificationEmail } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatarUrl: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setUserProfile(profile);
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        avatarUrl: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    setIsUpdating(true);
    try {
      const updates: Partial<UserProfile> = {
        full_name: formData.fullName,
        avatar_url: formData.avatarUrl,
        // email updates are typically handled separately via Supabase auth.updateUser
      };
      const updatedProfile = await authService.updateUserProfile(user.id, updates);
      setUserProfile(updatedProfile);
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: (error as Error).message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const avatarUrl = await userService.uploadProfilePicture(user.id, file);
      setUserProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user?.email) return;
    setVerificationMessage("Sending...");
    try {
      // Use resendVerificationEmail from useAuth context
      const { error } = await resendVerificationEmail(user.email);
      if (error) {
        setVerificationMessage(`Error: ${error.message}`);
      } else {
        setVerificationMessage("Verification email sent. Please check your inbox.");
      }
    } catch (err) {
      setVerificationMessage("Failed to send verification email.");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    // Temporarily commenting out until deleteAccount is implemented
    // if (!user) return;
    // if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    //   try {
    //     // await authService.deleteAccount(); // This method needs to be implemented
    //     toast({ title: "Account Deletion Initiated", description: "Follow instructions if any, or this feature is pending." });
    //     // router.push("/auth/login"); // Redirect after deletion
    //   } catch (error) {
    //     toast({ variant: "destructive", title: "Deletion Failed", description: (error as Error).message });
    //   }
    // }
    toast({ title: "Feature Pending", description: "Account deletion is not yet implemented." });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!user?.email_confirmed_at && (
            <Alert className="mb-4">
              <Mail className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Please verify your email address.
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto"
                  onClick={handleSendVerification}
                  disabled={verificationMessage === "Sending..."}
                >
                  {verificationMessage || "Resend verification email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userProfile?.avatar_url || `https://avatar.vercel.sh/${user?.email}.png`}
                  alt={userProfile?.full_name || user?.email || "User"}
                />
                <AvatarFallback>
                  {userProfile?.full_name
                    ? userProfile.full_name.substring(0, 2).toUpperCase()
                    : user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 p-1 bg-background border rounded-full cursor-pointer hover:bg-muted"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled={true}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={deletingAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </form>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data including notes, notebooks, and files.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || deletingAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deletingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
