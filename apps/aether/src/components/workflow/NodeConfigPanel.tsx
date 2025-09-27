
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Folder } from "lucide-react";
import { Node } from "reactflow";
import { WorkflowNode } from "@/types/database";
import { FilePickerDialog } from "./FilePickerDialog";

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
  workflowId: string;
}

export function NodeConfigPanel({ selectedNode, onConfigChange, workflowId }: NodeConfigPanelProps) {
  const [filePickerOpen, setFilePickerOpen] = useState(false);
  const [filePickerMode, setFilePickerMode] = useState<"file" | "folder">("file");
  const [filePickerField, setFilePickerField] = useState<string>("");

  if (!selectedNode) return null;

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = {
      ...selectedNode.data.configuration,
      [key]: value
    };
    onConfigChange(selectedNode.id, newConfig);
  };

  const handleFilePickerOpen = (mode: "file" | "folder", field: string) => {
    setFilePickerMode(mode);
    setFilePickerField(field);
    setFilePickerOpen(true);
  };

  const handleFileSelect = (path: string) => {
    handleConfigChange(filePickerField, path);
  };

  const renderBasicConfig = () => {
    switch (selectedNode.type) {
      case "file.copy":
      case "file.move":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source Path</Label>
              <div className="flex gap-2">
                <Input
                  id="source"
                  value={selectedNode.data.configuration.source || ""}
                  onChange={(e) => handleConfigChange("source", e.target.value)}
                  placeholder="Enter source path"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleFilePickerOpen("file", "source")}
                  aria-label="Browse files"
                >
                  <Folder className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Path</Label>
              <div className="flex gap-2">
                <Input
                  id="destination"
                  value={selectedNode.data.configuration.destination || ""}
                  onChange={(e) => handleConfigChange("destination", e.target.value)}
                  placeholder="Enter destination path"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleFilePickerOpen("folder", "destination")}
                  aria-label="Browse folders"
                >
                  <Folder className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "logic.if":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={selectedNode.data.configuration.condition || ""}
                onChange={(e) => handleConfigChange("condition", e.target.value)}
                placeholder="Enter condition (e.g., value > 0)"
              />
            </div>
          </div>
        );

      case "logic.switch":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Switch Value</Label>
              <Input
                id="value"
                value={selectedNode.data.configuration.value || ""}
                onChange={(e) => handleConfigChange("value", e.target.value)}
                placeholder="Enter switch value"
              />
            </div>
          </div>
        );

      case "transform.convert":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source File</Label>
              <div className="flex gap-2">
                <Input
                  id="source"
                  value={selectedNode.data.configuration.source || ""}
                  onChange={(e) => handleConfigChange("source", e.target.value)}
                  placeholder="Select file to convert"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleFilePickerOpen("file", "source")}
                  aria-label="Browse files"
                >
                  <Folder className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Target Format</Label>
              <Input
                id="format"
                value={selectedNode.data.configuration.format || ""}
                onChange={(e) => handleConfigChange("format", e.target.value)}
                placeholder="Enter target format (e.g., pdf)"
              />
            </div>
          </div>
        );

      case "utility.delay":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Delay Duration (ms)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={selectedNode.data.configuration.duration || ""}
                onChange={(e) => handleConfigChange("duration", parseInt(e.target.value))}
                placeholder="Enter delay in milliseconds"
              />
            </div>
          </div>
        );

      default:
        return (
          <Alert>
            <AlertDescription>
              No configuration options available for this node type.
            </AlertDescription>
          </Alert>
        );
    }
  };

  const renderAdvancedConfig = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Node Description</Label>
          <Input
            id="description"
            value={selectedNode.data.description || ""}
            onChange={(e) => handleConfigChange("description", e.target.value)}
            placeholder="Enter node description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="errorBehavior">Error Behavior</Label>
          <Input
            id="errorBehavior"
            value={selectedNode.data.configuration.errorBehavior || ""}
            onChange={(e) => handleConfigChange("errorBehavior", e.target.value)}
            placeholder="How to handle errors"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Sheet open={!!selectedNode} modal={false}>
        <SheetContent className="w-[400px] border-l">
          <SheetHeader>
            <SheetTitle>{selectedNode.data.label}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-6 pb-4">
                {renderBasicConfig()}
              </TabsContent>
              <TabsContent value="advanced" className="space-y-6 pb-4">
                {renderAdvancedConfig()}
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <FilePickerDialog
        open={filePickerOpen}
        onOpenChange={setFilePickerOpen}
        workflowId={workflowId}
        onSelect={handleFileSelect}
        mode={filePickerMode}
        title={`Select ${filePickerMode === "file" ? "File" : "Folder"}`}
      />
    </>
  );
}
