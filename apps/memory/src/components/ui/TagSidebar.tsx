import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockTags = ["#research", "#todo", "#meeting", "#idea"];

export default function TagsSidebar({ onTagSelect }) {
  return (
    <aside className="w-56 p-4 border-r bg-muted/40 h-full">
      <h3 className="text-lg font-bold mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {mockTags.map(tag => (
          <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => onTagSelect(tag)}>
            {tag}
          </Badge>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full">Add Tag</Button>
    </aside>
  );
}