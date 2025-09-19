import React from 'react'
import Head from 'next/head'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GitBranch, 
  Zap, 
  Globe, 
  BarChart3, 
  Settings, 
  Shield,
  CheckCircle,
  ArrowLeft,
  Rocket,
  Eye,
  Activity
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <Head>
        <title>How It Works - Deploy</title>
        <meta name="description" content="Learn how Deploy makes web hosting simple with our step-by-step guide" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-20">
            <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ 
                textShadow: "0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)" 
              }}
            >
              How It Works
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From code to live site in minutes. Our platform simplifies web deployment 
              so you can focus on building amazing experiences.
            </p>
          </div>

          {/* Step-by-Step Process */}
          <div className="space-y-16 mb-20">
            {/* Step 1: Connect Your Project */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-4 neon-border">
                      <span className="text-cyan-400 font-bold text-lg">1</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Connect Your Project</h2>
                  </div>
                  <p className="text-gray-300 text-lg mb-6">
                    Start by connecting your Git repository or uploading your project files. 
                    We support GitHub, GitLab, Bitbucket, and direct file uploads.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      GitHub, GitLab, Bitbucket integration
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Drag & drop file upload
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Automatic framework detection
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <Card className="glass-card relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <GitBranch className="w-8 h-8 text-cyan-400" />
                        <div className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                          main branch
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-2">my-awesome-project</h3>
                      <p className="text-gray-400 text-sm mb-4">React • TypeScript • Next.js</p>
                      <div className="bg-gray-800/30 rounded p-3 text-xs text-gray-300 font-mono">
                        <div>📦 package.json detected</div>
                        <div>⚡ Build command: npm run build</div>
                        <div>📁 Output directory: dist/</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Step 2: Configure & Deploy */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-4 neon-border">
                      <span className="text-cyan-400 font-bold text-lg">2</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Configure & Deploy</h2>
                  </div>
                  <p className="text-gray-300 text-lg mb-6">
                    Set up environment variables, choose your build settings, and hit deploy. 
                    Our intelligent build system handles the rest automatically.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Environment variables management
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Custom build commands
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Instant preview deployments
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <Card className="glass-card relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <Settings className="w-8 h-8 text-cyan-400" />
                        <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                          Building
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-4">Deployment Configuration</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-800/30 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Environment Variables</div>
                          <div className="text-sm text-gray-300 font-mono">NODE_ENV=production</div>
                        </div>
                        <div className="bg-gray-800/30 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Build Command</div>
                          <div className="text-sm text-gray-300 font-mono">npm run build</div>
                        </div>
                        <div className="bg-gray-800/30 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Output Directory</div>
                          <div className="text-sm text-gray-300 font-mono">out/</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Step 3: Go Live */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-4 neon-border">
                      <span className="text-cyan-400 font-bold text-lg">3</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Go Live Instantly</h2>
                  </div>
                  <p className="text-gray-300 text-lg mb-6">
                    Your site is deployed to our global CDN instantly. Get a unique URL and 
                    custom domain support with automatic SSL certificates.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Global CDN deployment
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Custom domain support
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Automatic SSL certificates
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <Card className="glass-card relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <Globe className="w-8 h-8 text-cyan-400" />
                        <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Live
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-4">Your Site is Live!</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-800/30 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Production URL</div>
                          <div className="text-sm text-cyan-400 font-mono">my-awesome-project.deploy.app</div>
                        </div>
                        <div className="bg-gray-800/30 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Custom Domain</div>
                          <div className="text-sm text-cyan-400 font-mono">www.mysite.com</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-400 text-sm">
                            <Shield className="w-4 h-4 mr-2" />
                            SSL Enabled
                          </div>
                          <div className="flex items-center text-cyan-400 text-sm">
                            <Zap className="w-4 h-4 mr-2" />
                            Edge Cached
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Step 4: Monitor & Scale */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-4 neon-border">
                      <span className="text-cyan-400 font-bold text-lg">4</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Monitor & Scale</h2>
                  </div>
                  <p className="text-gray-300 text-lg mb-6">
<<<<<<< HEAD
                    Track your site's performance with real-time analytics, monitor deployments, 
=======
                    Track your site&apos;s performance with real-time analytics, monitor deployments, 
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
                    and scale automatically as your traffic grows.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Real-time analytics & metrics
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Deployment logs & history
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                      Automatic scaling & performance optimization
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <Card className="glass-card relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="w-8 h-8 text-cyan-400" />
                        <div className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                          Last 24h
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-4">Performance Dashboard</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Page Views</span>
                          <span className="text-white font-semibold">12,847</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Avg Load Time</span>
                          <span className="text-green-400 font-semibold">247ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Uptime</span>
                          <span className="text-green-400 font-semibold">99.99%</span>
                        </div>
                        <div className="bg-gray-800/30 rounded p-2 mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Bandwidth</span>
                            <span>2.4 GB / 10 GB</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div className="bg-cyan-400 h-1 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Choose Deploy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glass-card group hover:neon-border transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Rocket className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white text-xl">Zero Config Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    No complex configuration files or server management. Just connect your repo and deploy.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card group hover:neon-border transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white text-xl">Preview Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Every branch gets its own preview URL for testing changes before going live.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card group hover:neon-border transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white text-xl">Real-time Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Track performance, uptime, and user analytics with our comprehensive dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Getting Started CTA */}
          <div className="text-center bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Deploy your first site in under 5 minutes. No credit card required for our free tier.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/deploy">
                <Button 
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Deploying
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 px-8 py-4 text-lg transition-all duration-300"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
