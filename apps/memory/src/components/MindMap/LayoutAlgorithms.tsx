import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MindMapNode } from "@/services/mindMapService";
import { 
  Network, 
  GitBranch, 
  Target, 
  Grid, 
  Zap, 
  RotateCw,
  Settings
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface LayoutAlgorithmsProps {
  nodes: MindMapNode[];
  onApplyLayout: (nodes: MindMapNode[], layoutType: string) => void;
  currentLayout: string;
  isOpen: boolean;
  onClose: () => void;
}

interface LayoutConfig {
  spacing: number;
  centerX: number;
  centerY: number;
  radius: number;
  levels: number;
}

export function LayoutAlgorithms({ 
  nodes, 
  onApplyLayout, 
  currentLayout,
  isOpen,
  onClose 
}: LayoutAlgorithmsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<LayoutConfig>({
    spacing: 150,
    centerX: 400,
    centerY: 300,
    radius: 200,
    levels: 3
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const layouts = [
    {
      id: "force",
      name: "Force-Directed",
      icon: Network,
      description: "Nodes repel each other while connections pull them together",
      color: "bg-blue-500"
    },
    {
      id: "hierarchical",
      name: "Hierarchical",
      icon: GitBranch,
      description: "Tree-like structure with clear parent-child relationships",
      color: "bg-green-500"
    },
    {
      id: "radial",
      name: "Radial",
      icon: Target,
      description: "Nodes arranged in concentric circles around a center",
      color: "bg-purple-500"
    },
    {
      id: "grid",
      name: "Grid",
      icon: Grid,
      description: "Organized in a regular grid pattern",
      color: "bg-orange-500"
    },
    {
      id: "circular",
      name: "Circular",
      icon: RotateCw,
      description: "Nodes arranged in a perfect circle",
      color: "bg-pink-500"
    },
    {
      id: "organic",
      name: "Organic",
      icon: Zap,
      description: "Natural, flowing arrangement based on content similarity",
      color: "bg-teal-500"
    }
  ];

  const applyForceDirectedLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    // Simple force-directed algorithm implementation
    const iterations = 50;
    const k = Math.sqrt((800 * 600) / nodeList.length); // Optimal distance
    const c = 0.1; // Cooling factor
    
    let positions = nodeList.map(node => ({
      id: node.id,
      x: node.position?.x || Math.random() * 800,
      y: node.position?.y || Math.random() * 600,
      vx: 0,
      vy: 0
    }));

    for (let iter = 0; iter < iterations; iter++) {
      // Calculate repulsive forces
      for (let i = 0; i < positions.length; i++) {
        positions[i].vx = 0;
        positions[i].vy = 0;
        
        for (let j = 0; j < positions.length; j++) {
          if (i !== j) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (k * k) / distance;
            
            positions[i].vx += (dx / distance) * force;
            positions[i].vy += (dy / distance) * force;
          }
        }
      }

      // Calculate attractive forces (for connected nodes)
      nodeList.forEach(node => {
        if (node.linkedNotes) {
          node.linkedNotes.forEach(linkedId => {
            const sourcePos = positions.find(p => p.id === node.id);
            const targetPos = positions.find(p => p.id === linkedId);
            
            if (sourcePos && targetPos) {
              const dx = targetPos.x - sourcePos.x;
              const dy = targetPos.y - sourcePos.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = (distance * distance) / k;
              
              sourcePos.vx += (dx / distance) * force * 0.5;
              sourcePos.vy += (dy / distance) * force * 0.5;
              targetPos.vx -= (dx / distance) * force * 0.5;
              targetPos.vy -= (dy / distance) * force * 0.5;
            }
          });
        }
      });

      // Apply forces and cool down
      const temp = c * (iterations - iter) / iterations;
      positions.forEach(pos => {
        const velocity = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy) || 1;
        pos.x += (pos.vx / velocity) * Math.min(velocity, temp);
        pos.y += (pos.vy / velocity) * Math.min(velocity, temp);
        
        // Keep within bounds
        pos.x = Math.max(50, Math.min(750, pos.x));
        pos.y = Math.max(50, Math.min(550, pos.y));
      });
    }

    return nodeList.map(node => {
      const pos = positions.find(p => p.id === node.id);
      return {
        ...node,
        position: pos ? { x: pos.x, y: pos.y } : node.position
      };
    });
  };

  const applyHierarchicalLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    // Find root nodes (nodes with no incoming connections)
    const hasIncoming = new Set<string>();
    nodeList.forEach(node => {
      if (node.linkedNotes) {
        node.linkedNotes.forEach(linkedId => hasIncoming.add(linkedId));
      }
    });
    
    const roots = nodeList.filter(node => !hasIncoming.has(node.id));
    if (roots.length === 0 && nodeList.length > 0) {
      roots.push(nodeList[0]); // Fallback to first node
    }

    const levels: MindMapNode[][] = [];
    const visited = new Set<string>();
    const queue: { node: MindMapNode; level: number }[] = [];

    // BFS to assign levels
    roots.forEach(root => {
      queue.push({ node: root, level: 0 });
      visited.add(root.id);
    });

    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);

      if (node.linkedNotes) {
        node.linkedNotes.forEach(linkedId => {
          const linkedNode = nodeList.find(n => n.id === linkedId);
          if (linkedNode && !visited.has(linkedId)) {
            visited.add(linkedId);
            queue.push({ node: linkedNode, level: level + 1 });
          }
        });
      }
    }

    // Position nodes
    return nodeList.map(node => {
      let level = 0;
      let indexInLevel = 0;
      
      for (let l = 0; l < levels.length; l++) {
        const index = levels[l].findIndex(n => n.id === node.id);
        if (index !== -1) {
          level = l;
          indexInLevel = index;
          break;
        }
      }

      const levelWidth = levels[level]?.length || 1;
      const x = (indexInLevel + 1) * (800 / (levelWidth + 1));
      const y = 100 + level * config.spacing;

      return {
        ...node,
        position: { x, y }
      };
    });
  };

  const applyRadialLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    if (nodeList.length === 0) return nodeList;
    
    // Place first node at center
    const centerNode = nodeList[0];
    const remainingNodes = nodeList.slice(1);
    
    return nodeList.map((node, index) => {
      if (index === 0) {
        return {
          ...node,
          position: { x: config.centerX, y: config.centerY }
        };
      }
      
      const level = Math.floor((index - 1) / 6) + 1; // 6 nodes per level
      const indexInLevel = (index - 1) % 6;
      const nodesInLevel = Math.min(6, remainingNodes.length - (level - 1) * 6);
      const angle = (indexInLevel / nodesInLevel) * 2 * Math.PI;
      const radius = config.radius * level;
      
      const x = config.centerX + radius * Math.cos(angle);
      const y = config.centerY + radius * Math.sin(angle);
      
      return {
        ...node,
        position: { x, y }
      };
    });
  };

  const applyGridLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    const cols = Math.ceil(Math.sqrt(nodeList.length));
    const rows = Math.ceil(nodeList.length / cols);
    
    return nodeList.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const x = 100 + col * config.spacing;
      const y = 100 + row * config.spacing;
      
      return {
        ...node,
        position: { x, y }
      };
    });
  };

  const applyCircularLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    return nodeList.map((node, index) => {
      const angle = (index / nodeList.length) * 2 * Math.PI;
      const x = config.centerX + config.radius * Math.cos(angle);
      const y = config.centerY + config.radius * Math.sin(angle);
      
      return {
        ...node,
        position: { x, y }
      };
    });
  };

  const applyOrganicLayout = (nodeList: MindMapNode[]): MindMapNode[] => {
    // Group nodes by type for organic clustering
    const typeGroups: { [key: string]: MindMapNode[] } = {};
    nodeList.forEach(node => {
      const type = node.type || "default";
      if (!typeGroups[type]) typeGroups[type] = [];
      typeGroups[type].push(node);
    });

    const groupCenters: { [key: string]: { x: number; y: number } } = {};
    const types = Object.keys(typeGroups);
    
    // Assign centers for each type group
    types.forEach((type, index) => {
      const angle = (index / types.length) * 2 * Math.PI;
      groupCenters[type] = {
        x: config.centerX + (config.radius * 0.7) * Math.cos(angle),
        y: config.centerY + (config.radius * 0.7) * Math.sin(angle)
      };
    });

    return nodeList.map(node => {
      const type = node.type || "default";
      const group = typeGroups[type];
      const center = groupCenters[type];
      const indexInGroup = group.findIndex(n => n.id === node.id);
      
      // Arrange nodes in a small circle around their group center
      const groupRadius = Math.min(80, 20 + group.length * 10);
      const angle = (indexInGroup / group.length) * 2 * Math.PI;
      
      const x = center.x + groupRadius * Math.cos(angle);
      const y = center.y + groupRadius * Math.sin(angle);
      
      return {
        ...node,
        position: { x, y }
      };
    });
  };

  const handleApplyLayout = (layoutId: string) => {
    let layoutedNodes: MindMapNode[];
    
    switch (layoutId) {
      case "force":
        layoutedNodes = applyForceDirectedLayout([...nodes]);
        break;
      case "hierarchical":
        layoutedNodes = applyHierarchicalLayout([...nodes]);
        break;
      case "radial":
        layoutedNodes = applyRadialLayout([...nodes]);
        break;
      case "grid":
        layoutedNodes = applyGridLayout([...nodes]);
        break;
      case "circular":
        layoutedNodes = applyCircularLayout([...nodes]);
        break;
      case "organic":
        layoutedNodes = applyOrganicLayout([...nodes]);
        break;
      default:
        layoutedNodes = [...nodes];
    }
    
    onApplyLayout(layoutedNodes, layoutId);
  };

  return (
    <div 
      ref={panelRef}
      className="fixed right-4 top-20 z-50 animate-in slide-in-from-right-5 duration-200"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Network className="h-4 w-4" />
              Layout Algorithms
            </CardTitle>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Layout Configuration</h4>
                    
                    <div className="space-y-2">
                      <Label>Spacing: {config.spacing}px</Label>
                      <Slider
                        value={[config.spacing]}
                        onValueChange={([value]) => setConfig(prev => ({ ...prev, spacing: value }))}
                        min={50}
                        max={300}
                        step={10}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Radius: {config.radius}px</Label>
                      <Slider
                        value={[config.radius]}
                        onValueChange={([value]) => setConfig(prev => ({ ...prev, radius: value }))}
                        min={100}
                        max={400}
                        step={20}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Center X: {config.centerX}</Label>
                        <Slider
                          value={[config.centerX]}
                          onValueChange={([value]) => setConfig(prev => ({ ...prev, centerX: value }))}
                          min={200}
                          max={600}
                          step={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Center Y: {config.centerY}</Label>
                        <Slider
                          value={[config.centerY]}
                          onValueChange={([value]) => setConfig(prev => ({ ...prev, centerY: value }))}
                          min={150}
                          max={450}
                          step={50}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {layouts.map(layout => {
              const isActive = currentLayout === layout.id;
              const Icon = layout.icon;
              
              return (
                <Button
                  key={layout.id}
                  variant={isActive ? "default" : "outline"}
                  className="h-auto p-3 justify-start"
                  onClick={() => handleApplyLayout(layout.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-md ${layout.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{layout.name}</span>
                        {isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {layout.description}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Different layouts work better for different types of mind maps. 
              Try hierarchical for structured content, radial for central concepts, or force-directed for natural clustering.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
