import React from 'react'
import Head from 'next/head'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Globe, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Hello World</title>
        <meta name="description" content="Welcome to my app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 
              className="text-6xl md:text-7xl font-bold text-white mb-6"
              style={{ 
                textShadow: "0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)" 
              }}
            >
              Deploy
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Lightning-fast deployments with zero configuration. Deploy your sites instantly 
              and manage them with our powerful dashboard.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/deploy">
                <Button 
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
              
              <Link href="/how-it-works">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 px-8 py-4 text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white text-xl">Instant Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Deploy your sites in seconds with our optimized build pipeline and global CDN.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Globe className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white text-xl">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Your sites are served from our worldwide edge network for maximum performance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Built-in SSL, DDoS protection, and 99.9% uptime guarantee for your peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to deploy?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust Deploy for their web hosting needs.
            </p>
            
            <Link href="/deploy">
              <Button 
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
