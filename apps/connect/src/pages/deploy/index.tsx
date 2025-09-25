
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Eye, RotateCcw, Plus, Globe, Clock, AlertCircle } from "lucide-react";

type DeploymentStatus = "Live" | "Building" | "Error";

interface Deployment {
  id: string;
  name: string;
  status: DeploymentStatus;
  lastDeployed: string;
  deploymentHistoryCount: number;
  url?: string;
}

const mockDeployments: Deployment[] = [
  {
    id: "1",
    name: "Portfolio Website",
    status: "Live",
    lastDeployed: "2024-01-15T10:30:00Z",
    deploymentHistoryCount: 12,
    url: "https://portfolio.example.com"
  },
  {
    id: "2", 
    name: "E-commerce Store",
    status: "Building",
    lastDeployed: "2024-01-15T09:15:00Z",
    deploymentHistoryCount: 8,
    url: "https://store.example.com"
  },
  {
    id: "3",
    name: "Blog Platform",
    status: "Error",
    lastDeployed: "2024-01-14T16:45:00Z",
    deploymentHistoryCount: 5,
    url: "https://blog.example.com"
  },
  {
    id: "4",
    name: "Dashboard App",
    status: "Live",
    lastDeployed: "2024-01-13T14:20:00Z",
    deploymentHistoryCount: 1,
    url: "https://dashboard.example.com"
  },
  {
    id: "5",
    name: "Landing Page",
    status: "Live",
    lastDeployed: "2024-01-12T11:10:00Z",
    deploymentHistoryCount: 15,
    url: "https://landing.example.com"
  },
  {
    id: "6",
    name: "API Documentation",
    status: "Building",
    lastDeployed: "2024-01-11T08:30:00Z",
    deploymentHistoryCount: 3,
    url: "https://docs.example.com"
  }
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString();
}

function getStatusIcon(status: DeploymentStatus) {
  switch (status) {
    case "Live":
      return <Globe className="w-4 h-4" />;
    case "Building":
      return <Clock className="w-4 h-4 animate-spin" />;
    case "Error":
      return <AlertCircle className="w-4 h-4" />;
  }
}

function getStatusStyles(status: DeploymentStatus) {
  switch (status) {
    case "Live":
      return "bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20";
    case "Building":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20";
    case "Error":
      return "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20";
  }
}

interface DeploymentCardProps {
  deployment: Deployment;
}

function DeploymentCard({ deployment }: DeploymentCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300" 
              style={{ 
                textShadow: "0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.1)" 
              }}>
            {deployment.name}
          </h3>
          <Badge 
            className={`${getStatusStyles(deployment.status)} shadow-lg flex items-center gap-1.5 px-3 py-1`}
            variant="outline"
          >
            {getStatusIcon(deployment.status)}
            {deployment.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <Clock className="w-4 h-4" />
          <span>Last deployed {formatDate(deployment.lastDeployed)}</span>
        </div>
        
        {deployment.url && (
          <div className="flex items-center gap-2 text-cyan-400 text-sm mt-1">
            <Globe className="w-4 h-4" />
            <span className="truncate">{deployment.url}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="flex gap-3">
          <Link href={`/deploy/${deployment.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          <Button 
            variant="outline"
            disabled={deployment.deploymentHistoryCount <= 1}
            className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2 text-center">
          {deployment.deploymentHistoryCount} deployment{deployment.deploymentHistoryCount !== 1 ? "s" : ""}
        </div>
      </CardContent>
    </Card>
  );
}

function NewDeploymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [siteName, setSiteName] = useState("");

  const handleDeploy = () => {
    // TODO: Implement deployment logic
<<<<<<< HEAD
    console.log("Deploying:", { repoUrl, siteName });
=======
    // Deployment parameters: { repoUrl, siteName }
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    setIsOpen(false);
    setRepoUrl("");
    setSiteName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deployment
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl font-bold text-cyan-400"
            style={{ 
              textShadow: "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.2)" 
            }}
          >
            Deploy New Site
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-gray-300">Site Name</Label>
            <Input
              id="siteName"
              placeholder="My Awesome Site"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="bg-black/40 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repoUrl" className="text-gray-300">Repository URL</Label>
            <Input
              id="repoUrl"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-black/40 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDeploy}
              disabled={!repoUrl || !siteName}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Site
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400 hover:text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DeployDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ 
              textShadow: "0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.3), 0 0 45px rgba(0, 255, 255, 0.1)" 
            }}
          >
            Deploy Dashboard
          </h1>
          
          <NewDeploymentModal />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {mockDeployments.filter(d => d.status === "Live").length}
            </div>
            <div className="text-gray-400 text-sm">Live Sites</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {mockDeployments.filter(d => d.status === "Building").length}
            </div>
            <div className="text-gray-400 text-sm">Building</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {mockDeployments.filter(d => d.status === "Error").length}
            </div>
            <div className="text-gray-400 text-sm">Errors</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {mockDeployments.reduce((acc, d) => acc + d.deploymentHistoryCount, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Deploys</div>
          </div>
        </div>

        {/* Deployments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>

        {/* Empty State (if no deployments) */}
        {mockDeployments.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-12 max-w-md mx-auto">
              <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No deployments yet</h3>
              <p className="text-gray-400 mb-8">
                Get started by deploying your first site. It only takes a few minutes!
              </p>
              <NewDeploymentModal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
