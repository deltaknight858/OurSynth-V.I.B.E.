
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface NodeType {
  type: string;
  category: string;
  label: string;
  description: string;
  inputs?: { [key: string]: { type: string; required: boolean; description?: string } };
  outputs?: { [key: string]: { type: string; description?: string } };
  configTabs?: string[];
}

const NODE_TYPES: NodeType[] = [
  {
    type: "file.copy",
    category: "File Operations",
    label: "Copy File",
    description: "Copy a file from source to destination",
    inputs: {
      source: { 
        type: "file", 
        required: true,
        description: "Source file path to copy from"
      },
      destination: { 
        type: "path", 
        required: true,
        description: "Destination path to copy to"
      }
    },
    outputs: {
      success: { 
        type: "boolean",
        description: "Whether the copy operation succeeded"
      },
      filePath: { 
        type: "string",
        description: "Path of the copied file"
      }
    },
    configTabs: ["Basic", "Advanced"]
  },
  {
    type: "file.move",
    category: "File Operations",
    label: "Move File",
    description: "Move a file from source to destination",
    inputs: {
      source: { 
        type: "file", 
        required: true,
        description: "Source file path to move from"
      },
      destination: { 
        type: "path", 
        required: true,
        description: "Destination path to move to"
      }
    },
    outputs: {
      success: { 
        type: "boolean",
        description: "Whether the move operation succeeded"
      },
      filePath: { 
        type: "string",
        description: "Path of the moved file"
      }
    },
    configTabs: ["Basic", "Advanced"]
  },
  {
    type: "file.delete",
    category: "File Operations",
    label: "Delete File",
    description: "Delete a file from the system",
    inputs: {
      path: { 
        type: "file", 
        required: true,
        description: "Path of the file to delete"
      }
    },
    outputs: {
      success: { 
        type: "boolean",
        description: "Whether the delete operation succeeded"
      }
    }
  },
  {
    type: "logic.if",
    category: "Logic",
    label: "If Condition",
    description: "Branch workflow based on a condition",
    inputs: {
      condition: { 
        type: "boolean", 
        required: true,
        description: "Condition to evaluate"
      }
    },
    outputs: {
      true: { 
        type: "control",
        description: "Path taken when condition is true"
      },
      false: { 
        type: "control",
        description: "Path taken when condition is false"
      }
    },
    configTabs: ["Condition", "Advanced"]
  },
  {
    type: "logic.switch",
    category: "Logic",
    label: "Switch",
    description: "Branch workflow based on multiple conditions",
    inputs: {
      value: { 
        type: "any", 
        required: true,
        description: "Value to switch on"
      }
    },
    outputs: {
      default: { 
        type: "control",
        description: "Default path when no cases match"
      }
    },
    configTabs: ["Cases", "Advanced"]
  },
  {
    type: "transform.convert",
    category: "Transformations",
    label: "Convert Format",
    description: "Convert file between different formats",
    inputs: {
      source: { 
        type: "file", 
        required: true,
        description: "Source file to convert"
      },
      format: { 
        type: "string", 
        required: true,
        description: "Target format"
      }
    },
    outputs: {
      success: { 
        type: "boolean",
        description: "Whether the conversion succeeded"
      },
      filePath: { 
        type: "string",
        description: "Path of the converted file"
      }
    },
    configTabs: ["Format", "Options"]
  },
  {
    type: "utility.delay",
    category: "Utilities",
    label: "Delay",
    description: "Add a delay between operations",
    inputs: {
      duration: { 
        type: "number", 
        required: true,
        description: "Delay duration in milliseconds"
      }
    },
    outputs: {
      completed: { 
        type: "boolean",
        description: "Whether the delay completed"
      }
    }
  }
];

export function NodeLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return NODE_TYPES;
    const query = searchQuery.toLowerCase();
    return NODE_TYPES.filter(
      node =>
        node.label.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const nodesByCategory = useMemo(() => {
    const categories: { [key: string]: NodeType[] } = {
      Favorites: NODE_TYPES.filter(node => favorites.includes(node.type))
    };
    
    filteredNodes.forEach(node => {
      if (!categories[node.category]) {
        categories[node.category] = [];
      }
      categories[node.category].push(node);
    });
    
    if (categories.Favorites.length === 0) {
      delete categories.Favorites;
    }
    
    return categories;
  }, [filteredNodes, favorites]);

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleFavorite = (nodeType: string) => {
    setFavorites(prev => 
      prev.includes(nodeType)
        ? prev.filter(type => type !== nodeType)
        : [...prev, nodeType]
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Node Library</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            aria-label="Search nodes"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {Object.entries(nodesByCategory).map(([category, nodes]) => (
            <div key={category} className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node)}
                    className="rounded-md border border-border bg-card p-3 cursor-move hover:border-primary transition-colors relative group"
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}: ${node.description}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{node.label}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(node.type);
                        }}
                        aria-label={`${favorites.includes(node.type) ? "Remove from" : "Add to"} favorites`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            favorites.includes(node.type) ? "fill-primary" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {node.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
