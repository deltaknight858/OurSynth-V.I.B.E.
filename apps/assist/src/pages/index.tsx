
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <>
      <Head>
<<<<<<< HEAD
        <title>V.I.B.E. Assist - Virtual Identity & Build Environment</title>
        <meta name="description" content="V.I.B.E. combines powerful code assistance and intelligent chat capabilities to enhance your development workflow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1 relative overflow-hidden">
        {/* Background Glass Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float opacity-70" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float opacity-70" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float opacity-70" style={{ animationDelay: '4s' }} />
        </div>

        <section className="container mx-auto px-4 py-24 text-center">
          <div className="glass-card max-w-4xl mx-auto animate-float">
            <h1 className="text-6xl font-bold mb-4">
              <span className="gradient-text animate-pulse-vibe">V.I.B.E.</span>
            </h1>
            <h2 className="text-2xl font-semibold neon-cyan mb-6">
              Virtual Identity & Build Environment
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Experience the future of development with AI-powered code assistance and intelligent chat support in one seamless platform
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="glass-button neon-glow">
                <a href="/codebot" className="neon-cyan">Try Codebot</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-button neon-glow">
                <a href="/chatbot" className="neon-purple">Explore Chatbot</a>
              </Button>
            </div>
=======
        <title>EbFlo - AI-Powered Development Assistant</title>
        <meta name="description" content="EbFlo combines powerful code assistance and intelligent chat capabilities to enhance your development workflow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-6">
            Your Intelligent Development Partner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Experience the future of development with AI-powered code assistance and intelligent chat support in one seamless platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/codebot">Try Codebot</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/chatbot">Explore Chatbot</a>
            </Button>
>>>>>>> main
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
<<<<<<< HEAD
            <Card className="glass-card neon-glow">
              <CardHeader>
                <CardTitle className="neon-cyan">Codebot</CardTitle>
=======
            <Card>
              <CardHeader>
                <CardTitle>Codebot</CardTitle>
>>>>>>> main
                <CardDescription>Advanced coding assistance powered by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
<<<<<<< HEAD
                  <li>• Code generation and optimization</li>
                  <li>• Intelligent debugging support</li>
                  <li>• Code review and best practices</li>
                  <li>• Documentation assistance</li>
=======
                  <li>Code generation and optimization</li>
                  <li>Intelligent debugging support</li>
                  <li>Code review and best practices</li>
                  <li>Documentation assistance</li>
>>>>>>> main
                </ul>
              </CardContent>
            </Card>

<<<<<<< HEAD
            <Card className="glass-card neon-glow">
              <CardHeader>
                <CardTitle className="neon-purple">Chatbot</CardTitle>
=======
            <Card>
              <CardHeader>
                <CardTitle>Chatbot</CardTitle>
>>>>>>> main
                <CardDescription>Smart conversational AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
<<<<<<< HEAD
                  <li>• Natural language interaction</li>
                  <li>• Task automation and scheduling</li>
                  <li>• Context-aware responses</li>
                  <li>• Personalized assistance</li>
=======
                  <li>Natural language interaction</li>
                  <li>Task automation and scheduling</li>
                  <li>Context-aware responses</li>
                  <li>Personalized assistance</li>
>>>>>>> main
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
