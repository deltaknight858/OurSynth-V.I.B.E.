import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface MindMapNode {
  id: string;
  mindMapId: string;
  title: string;
  content?: string;
  type?: string;
  position: { x: number; y: number };
  createdAt: Date;
  lastModified: Date;
}

interface MindMapSearchProps {
  nodes?: MindMapNode[];
  onNodeSelect?: (nodeId: string) => void;
}

export function MindMapSearch({ nodes = [], onNodeSelect }: MindMapSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get unique node types for filter options
  const availableTypes = useMemo(() => {
    const types = new Set((nodes || []).map(node => node.type || "default"));
    return Array.from(types);
  }, [nodes]);

  // Filter nodes by search query and type
  const filteredNodes = useMemo(() => {
    let filtered = nodes;
    if (selectedType) {
      filtered = filtered.filter(node => (node.type || "default") === selectedType);
    }
    if (query.trim()) {
      filtered = filtered.filter(
        node =>
          node.title?.toLowerCase().includes(query.toLowerCase()) ||
          node.content?.toLowerCase().includes(query.toLowerCase()) ||
          node.id.toLowerCase().includes(query.toLowerCase())
      );
    }
    return filtered;
  }, [nodes, query, selectedType]);

  return (
    <div className="bg-background/60 rounded-md p-2 border mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          placeholder="Search nodes…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <Badge
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => setSelectedType(null)}
          className="cursor-pointer"
        >
          All
        </Badge>
        {availableTypes.map(type => (
          <Badge
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type as string)}
            className="cursor-pointer capitalize"
          >
            {type}
          </Badge>
        ))}
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filteredNodes.length === 0 && (
          <div className="text-xs text-muted-foreground">No matching nodes found.</div>
        )}
        {filteredNodes.map(node => (
          <div
            key={node.id}
            className="flex items-center justify-between border rounded px-2 py-1 text-xs hover:bg-muted cursor-pointer"
            onClick={() => onNodeSelect && onNodeSelect(node.id)}
          >
            <span className="truncate max-w-[160px] font-mono" title={node.title || node.id}>
              {node.title || node.id.slice(0, 6)}
            </span>
            <span className="ml-2 text-muted-foreground capitalize">{node.type || "default"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}