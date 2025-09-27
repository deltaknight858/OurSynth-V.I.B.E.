import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Globe, Settings } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await authService.signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="glass-card p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">Welcome to Dashboard</h1>
                <p className="text-gray-300">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={signOutLoading}
              variant="outline"
              className="bg-transparent hover:bg-red-500/10 border-red-400/30 text-red-400 hover:text-red-300"
            >
              {signOutLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Domain Management Card */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Globe className="h-5 w-5 mr-2 text-cyan-400" />
                Domain Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Manage your domain portfolio and search for new domains.
              </p>
              <Button
                onClick={() => router.push("/domains")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                View Domains
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="h-5 w-5 mr-2 text-purple-400" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Update your profile and account preferences.
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-purple-500/10 border-purple-400/30 text-purple-400"
              >
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Domains</span>
                  <span className="text-cyan-400 font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Searches</span>
                  <span className="text-purple-400 font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Account Status</span>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="glass-card p-6 rounded-xl mt-6">
          <h2 className="text-xl font-semibold text-white mb-3">Getting Started</h2>
          <p className="text-gray-300 mb-4">
            Welcome to your domain management dashboard! Here you can search for new domains, 
            manage your existing portfolio, and track your domain investments.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push("/domains")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Globe className="h-4 w-4 mr-2" />
              Search Domains
            </Button>
            <Button
              variant="outline"
              className="bg-transparent hover:bg-white/10 border-white/20 text-white"
            >
              View Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}