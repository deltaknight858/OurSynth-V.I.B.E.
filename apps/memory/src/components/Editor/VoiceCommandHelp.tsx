import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Kbd } from "@/components/ui/kbd";

interface CommandExample {
  command: string;
  description: string;
  examples: string[];
  category: "note" | "notebook" | "organization" | "collaboration" | "export";
}

const VOICE_COMMANDS: CommandExample[] = [
  {
    command: "Create Note",
    description: "Create a new note with a specified title",
    examples: [
      "Create a new note called Shopping List",
      "Create note titled Project Ideas"
    ],
    category: "note"
  },
  {
    command: "Create Notebook",
    description: "Create a new notebook with a specified title",
    examples: [
      "Create a new notebook called Work",
      "Create notebook titled Personal"
    ],
    category: "notebook"
  },
  {
    command: "Add Tag",
    description: "Add a tag to the current note",
    examples: [
      "Add tag important",
      "Add tag work"
    ],
    category: "organization"
  },
  {
    command: "Search Notes",
    description: "Search through your notes",
    examples: [
      "Search for meeting notes",
      "Search shopping list"
    ],
    category: "organization"
  },
  {
    command: "Export Note",
    description: "Export the current note in various formats",
    examples: [
      "Export note as pdf",
      "Export as markdown",
      "Export as html"
    ],
    category: "export"
  },
  {
    command: "Share Note",
    description: "Share the current note with someone via email",
    examples: [
      "Share note with john@example.com",
      "Share with team@company.com"
    ],
    category: "collaboration"
  },
  {
    command: "Delete Note",
    description: "Delete the current note",
    examples: [
      "Delete this note",
      "Delete note"
    ],
    category: "note"
  },
  {
    command: "Link Notes",
    description: "Link the current note to another note by title",
    examples: [
      "Link note to Project Overview",
      "Link to Meeting Minutes"
    ],
    category: "organization"
  },
  {
    command: "Add Tag",
    description: "Add a tag to the current note",
    examples: [
      "Add tag important",
      "Add tag work"
    ],
    category: "organization"
  },
  {
    command: "Pin this note",
    description: "Pin the current note",
    examples: [
      "Pin this note",
      "Pin note"
    ],
    category: "note"
  }
];

const CATEGORIES = {
  note: { label: "Note Management", description: "Create, edit, and delete notes" },
  notebook: { label: "Notebooks", description: "Manage your notebooks" },
  organization: { label: "Organization", description: "Search, tag, and link notes" },
  collaboration: { label: "Collaboration", description: "Share and collaborate on notes" },
  export: { label: "Export", description: "Export notes in different formats" }
};

export function VoiceCommandHelp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES | "all">("all");

  const filteredCommands = VOICE_COMMANDS.filter(cmd => {
    const matchesSearch = 
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.examples.some(ex => ex.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || cmd.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Voice Commands Guide</DialogTitle>
          <DialogDescription>
            Use these voice commands to control your note-taking experience. Search commands or browse by category.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as any)}>
            <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Commands
              </TabsTrigger>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <TabsTrigger 
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <div className="grid gap-4">
                {filteredCommands.map((cmd) => (
                  <Card key={cmd.command}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        {cmd.command}
                        <span className="text-sm font-normal text-muted-foreground">
                          {CATEGORIES[cmd.category].label}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {cmd.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Examples:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {cmd.examples.map((example, i) => (
                            <li key={i} className="text-muted-foreground">
                              &quot;{example}&quot;
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCommands.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No commands match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
