import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Code, FileCode, Play, Copy, Download } from "lucide-react";

export default function CodebotPanel() {
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
    setTimeout(() => {
      const generatedCode = `// Generated code based on: ${prompt}\n\nfunction example() {\n  console.log(\"This is a placeholder for generated code\");\n  return \"Success!\";\n}\n\nexample();`;
      setCode(generatedCode);
      setIsLoading(false);
    }, 1500);
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Codebot</CardTitle>
        <CardDescription>AI-powered coding assistant</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="generate"><Code className="h-4 w-4 mr-2" />Generate Code</TabsTrigger>
            <TabsTrigger value="debug"><FileCode className="h-4 w-4 mr-2" />Debug Code</TabsTrigger>
            <TabsTrigger value="optimize"><Play className="h-4 w-4 mr-2" />Optimize Code</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="space-y-4">
            <Textarea 
              placeholder="Describe what you want to build..."
              className="min-h-[120px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={handleGenerateCode} disabled={isLoading || !prompt.trim()} className="w-full">
              {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>) : (<>Generate Code</>)}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {code && (
              <Card>
                <CardHeader><CardTitle>Generated Code</CardTitle></CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted font-mono text-sm">
                    <pre ref={codeAreaRef}>{code}</pre>
                  </ScrollArea>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCopyCode} disabled={!code}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadCode} disabled={!code}><Download className="h-4 w-4 mr-2" />Download</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="debug">
            <Textarea placeholder="Paste your code here..." className="min-h-[200px] font-mono" />
            <Button className="w-full">Debug Code</Button>
          </TabsContent>
          <TabsContent value="optimize">
            <Textarea placeholder="Paste your code here..." className="min-h-[200px] font-mono" />
            <Button className="w-full">Optimize Code</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
