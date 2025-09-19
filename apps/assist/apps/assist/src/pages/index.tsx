
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <>
      <Head>
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
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Codebot</CardTitle>
                <CardDescription>Advanced coding assistance powered by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Code generation and optimization</li>
                  <li>Intelligent debugging support</li>
                  <li>Code review and best practices</li>
                  <li>Documentation assistance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chatbot</CardTitle>
                <CardDescription>Smart conversational AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Natural language interaction</li>
                  <li>Task automation and scheduling</li>
                  <li>Context-aware responses</li>
                  <li>Personalized assistance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
