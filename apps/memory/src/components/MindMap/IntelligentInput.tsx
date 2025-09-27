import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Lightbulb, Target, Code, FileText, Hash, Wand2 } from "lucide-react";
import { nodeTemplates } from "./MindMapTemplates";

interface IntelligentInputProps {
  onCreateNode: (nodeData: {
    title: string;
    content: string;
    type: string;
    suggestedConnections?: string[];
    extractedTags?: string[];
  }) => void;
  existingNodes: Array<{ id: string; title: string; content?: string; type?: string }>;
}

interface AnalysisResult {
  suggestedType: string;
  confidence: number;
  extractedTags: string[];
  suggestedConnections: string[];
  keyPhrases: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export function IntelligentInput({ onCreateNode, existingNodes }: IntelligentInputProps) {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Simple NLP-like analysis using pattern matching and keywords
  const analyzeInput = useCallback((text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();
    
    // Extract hashtags
    const extractedTags = text.match(/#\w+/g) || [];
    
    // Extract key phrases (simple implementation)
    const keyPhrases = text.match(/\b\w{4,}\b/g)?.slice(0, 5) || [];
    
    // Determine sentiment (basic implementation)
    const positiveWords = ["good", "great", "excellent", "amazing", "wonderful", "success", "achieve"];
    const negativeWords = ["bad", "terrible", "awful", "problem", "issue", "fail", "error"];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    if (positiveCount > negativeCount) sentiment = "positive";
    else if (negativeCount > positiveCount) sentiment = "negative";
    
    // Suggest node type based on content patterns
    let suggestedType = "default";
    let confidence = 0.5;
    
    // Code detection
    if (lowerText.includes("function") || lowerText.includes("class") || 
        lowerText.includes("import") || lowerText.includes("const") ||
        text.includes("{") || text.includes("}") || text.includes("()")) {
      suggestedType = "code";
      confidence = 0.9;
    }
    // Task detection
    else if (lowerText.includes("todo") || lowerText.includes("task") || 
             lowerText.includes("complete") || lowerText.includes("finish") ||
             text.includes("- [ ]") || text.includes("☐")) {
      suggestedType = "task";
      confidence = 0.8;
    }
    // Idea detection
    else if (lowerText.includes("idea") || lowerText.includes("brainstorm") || 
             lowerText.includes("concept") || lowerText.includes("think")) {
      suggestedType = "idea";
      confidence = 0.7;
    }
    // Goal detection
    else if (lowerText.includes("goal") || lowerText.includes("objective") || 
             lowerText.includes("target") || lowerText.includes("achieve")) {
      suggestedType = "goal";
      confidence = 0.8;
    }
    // Link detection
    else if (text.includes("http") || text.includes("www.") || text.includes(".com")) {
      suggestedType = "link";
      confidence = 0.9;
    }
    // Table detection
    else if (text.includes("|") && text.split("\n").length > 1) {
      suggestedType = "table";
      confidence = 0.8;
    }
    // Event detection
    else if (lowerText.includes("meeting") || lowerText.includes("event") || 
             lowerText.includes("deadline") || lowerText.includes("schedule")) {
      suggestedType = "event";
      confidence = 0.7;
    }
    
    // Find potential connections with existing nodes
    const suggestedConnections = existingNodes
      .filter(node => {
        const nodeText = (node.title + " " + (node.content || "")).toLowerCase();
        return keyPhrases.some(phrase => nodeText.includes(phrase.toLowerCase())) ||
               extractedTags.some(tag => nodeText.includes(tag.toLowerCase()));
      })
      .map(node => node.id)
      .slice(0, 3);
    
    return {
      suggestedType,
      confidence,
      extractedTags,
      suggestedConnections,
      keyPhrases,
      sentiment
    };
  }, [existingNodes]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = analyzeInput(input);
    setAnalysis(result);
    setSelectedType(result.suggestedType);
    
    // Auto-generate title if not provided
    if (!title) {
      const firstLine = input.split("\n")[0];
      setTitle(firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine);
    }
    
    setIsAnalyzing(false);
  };

  const handleCreate = () => {
    if (!title.trim() || !input.trim()) return;
    
    onCreateNode({
      title: title.trim(),
      content: input.trim(),
      type: selectedType || "default",
      suggestedConnections: analysis?.suggestedConnections || [],
      extractedTags: analysis?.extractedTags || []
    });
    
    // Reset form
    setInput("");
    setTitle("");
    setAnalysis(null);
    setSelectedType(null);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Intelligent Node Creator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input & Analysis</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis}>
              Results & Creation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Node Title (optional)</label>
                <Input
                  placeholder="Enter a title for your node..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="Enter your content here... The AI will analyze it and suggest the best node type and connections."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Analyze Content"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {analysis && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Suggested Node Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(
                          nodeTemplates.find(t => t.id === analysis.suggestedType)?.icon || FileText,
                          { className: "h-5 w-5" }
                        )}
                        <span className="font-medium">
                          {nodeTemplates.find(t => t.id === analysis.suggestedType)?.name || "Note"}
                        </span>
                        <Badge variant="secondary">
                          {Math.round(analysis.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {nodeTemplates.find(t => t.id === analysis.suggestedType)?.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Content Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Sentiment: </span>
                          <span className={`text-sm ${getSentimentColor(analysis.sentiment)}`}>
                            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Key Phrases: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.keyPhrases.map((phrase, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {phrase}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {analysis.extractedTags.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Extracted Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.extractedTags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analysis.suggestedConnections.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Suggested Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.suggestedConnections.map(nodeId => {
                          const node = existingNodes.find(n => n.id === nodeId);
                          return node ? (
                            <div key={nodeId} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <span className="text-sm font-medium">{node.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {nodeTemplates.find(t => t.id === node.type)?.name || "Note"}
                              </Badge>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Node Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {nodeTemplates.slice(0, 8).map(template => (
                      <Button
                        key={template.id}
                        variant={selectedType === template.id ? "default" : "outline"}
                        size="sm"
                        className="h-auto p-3 flex flex-col items-center gap-1"
                        onClick={() => setSelectedType(template.id)}
                      >
                        <template.icon className="h-4 w-4" />
                        <span className="text-xs">{template.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleCreate}
                  disabled={!title.trim() || !selectedType}
                  className="w-full"
                  size="lg"
                >
                  Create Intelligent Node
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}