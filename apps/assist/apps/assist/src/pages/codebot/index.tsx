
import { useState, useRef } from "react";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Code, FileCode, Play, Copy, Download } from "lucide-react";

export default function Codebot() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeAreaRef = useRef<HTMLPreElement>(null);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate code generation - in a real implementation, this would call an API
      setTimeout(() => {
        const generatedCode = `// Generated code based on: ${prompt}\n\nfunction example() {\n  console.log("This is a placeholder for generated code");\n  // Implementation would go here\n  return "Success!";\n}\n\n// Usage\nexample();`;
        setCode(generatedCode);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setError("Failed to generate code. Please try again.");
      console.error("Error generating code:", error);
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-code.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Codebot - EbFlo</title>
          <meta name="description" content="Advanced AI-powered coding assistance for developers" />
        </Head>
        <div className="container mx-auto px-4 py-6">
          <Card className="p-4 text-center">
            Please sign in to use the codebot.
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Codebot - EbFlo</title>
        <meta name="description" content="Advanced AI-powered coding assistance for developers" />
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Codebot</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode} disabled={!code}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCode} disabled={!code}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="generate">
                <Code className="h-4 w-4 mr-2" />
                Generate Code
              </TabsTrigger>
              <TabsTrigger value="debug">
                <FileCode className="h-4 w-4 mr-2" />
                Debug Code
              </TabsTrigger>
              <TabsTrigger value="optimize">
                <Play className="h-4 w-4 mr-2" />
                Optimize Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Code</CardTitle>
                  <CardDescription>
                    Describe what you want to build, and Codebot will generate the code for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Describe what you want to build... (e.g., 'Create a React component that displays a list of items with pagination')"
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button 
                      onClick={handleGenerateCode} 
                      disabled={isLoading || !prompt.trim()}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>Generate Code</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {code && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted font-mono text-sm">
                      <pre ref={codeAreaRef}>{code}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="debug">
              <Card>
                <CardHeader>
                  <CardTitle>Debug Code</CardTitle>
                  <CardDescription>
                    Paste your code here, and Codebot will help you identify and fix issues.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Paste your code here..."
                      className="min-h-[200px] font-mono"
                    />
                    <Button className="w-full">Debug Code</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="optimize">
              <Card>
                <CardHeader>
                  <CardTitle>Optimize Code</CardTitle>
                  <CardDescription>
                    Paste your code here, and Codebot will suggest optimizations for performance and readability.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Paste your code here..."
                      className="min-h-[200px] font-mono"
                    />
                    <Button className="w-full">Optimize Code</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
