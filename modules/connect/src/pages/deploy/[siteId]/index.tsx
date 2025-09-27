import { useRouter } from "next/router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeployments } from "@/hooks/useDeployments";
import LogViewer from "@/components/LogViewer";
import MetricsChart from "@/components/MetricsChart";
import EnvManager from "@/components/EnvManager";
import { 
  ExternalLink, 
  GitBranch, 
  Calendar, 
  Globe, 
  Settings,
  Activity,
  FileText,
  Zap
} from "lucide-react";

export default function SiteDetailPage() {
  const router = useRouter();
  const { siteId } = router.query;
  const { getDeploymentById } = useDeployments();
  const [activeTab, setActiveTab] = useState("overview");

  if (!siteId || typeof siteId !== "string") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const deployment = getDeploymentById(siteId);

  if (!deployment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Deployment not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Building":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card relative p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{deployment.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {deployment.url}
                  </a>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span>{deployment.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(deployment.lastDeployed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(deployment.status)} px-3 py-1`}>
              {deployment.status}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card p-1 bg-black/40 border-white/10">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsChart />
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Redeploy Latest
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    View Source Code
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Download Build
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogViewer siteId={siteId} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <EnvManager siteId={siteId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
