import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Clock } from "lucide-react";

const mockRecent = [
  { id: "1", title: "Project Overview" },
  { id: "2", title: "Sprint Plan" },
];
const mockStarred = [
  { id: "3", title: "Important Node" },
];

export default function QuickAccessPanel({ onSelect }) {
  return (
    <Card className="fixed bottom-4 right-4 w-72 p-4 shadow-lg z-50 bg-background">
      <div className="mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span className="font-semibold">Recent</span>
      </div>
      <ul className="mb-4">
        {mockRecent.map(item => (
          <li key={item.id} className="mb-1 cursor-pointer hover:underline" onClick={() => onSelect(item.id)}>
            {item.title}
          </li>
        ))}
      </ul>
      <div className="mb-2 flex items-center">
        <Star className="h-4 w-4 mr-2 text-yellow-500" />
        <span className="font-semibold">Starred</span>
      </div>
      <ul>
        {mockStarred.map(item => (
          <li key={item.id} className="mb-1 cursor-pointer hover:underline" onClick={() => onSelect(item.id)}>
            {item.title}
          </li>
        ))}
      </ul>
    </Card>
  );
}