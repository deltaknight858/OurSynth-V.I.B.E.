import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockHistory = [
  {
    id: 1,
    date: "2025-06-16 08:00",
    user: "OuroDave",
    summary: "Added new node: 'Project Ideas'",
  },
  {
    id: 2,
    date: "2025-06-15 19:22",
    user: "OuroDave",
    summary: "Edited node: 'Meeting Notes'",
  },
  {
    id: 3,
    date: "2025-06-15 14:05",
    user: "CollaboratorX",
    summary: "Deleted node: 'Old Concept'",
  },
];

export default function VersionHistory() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Version History</h2>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-muted-foreground">
            {mockHistory.map(entry => (
              <li key={entry.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{entry.summary}</div>
                  <div className="text-xs text-muted-foreground">{entry.date} by {entry.user}</div>
                </div>
                <Button size="sm" variant="outline">Restore</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}