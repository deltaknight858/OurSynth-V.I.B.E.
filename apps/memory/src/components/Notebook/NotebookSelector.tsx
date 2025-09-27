
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Book } from "lucide-react";
import { Notebook, notebookService } from "@/services/notebookService";

interface NotebookSelectorProps {
  notebooks: Notebook[];
  selectedNotebookId?: string;
  onNotebookSelect: (notebookId: string) => void;
  onNotebookCreate: (notebook: Notebook) => void;
  userId: string;
}

export function NotebookSelector({
  notebooks,
  selectedNotebookId,
  onNotebookSelect,
  onNotebookCreate,
  userId
}: NotebookSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newNotebook, setNewNotebook] = useState({
    title: "",
    description: "",
    color: "#" + Math.floor(Math.random()*16777215).toString(16)
  });

  const handleCreateNotebook = async () => {
    try {
      const notebookId = await notebookService.createNotebook({
        ...newNotebook,
        userId
      });
      
      onNotebookCreate({
        ...newNotebook,
        id: notebookId,
        userId,
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      setNewNotebook({
        title: "",
        description: "",
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating notebook:", error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={selectedNotebookId} onValueChange={onNotebookSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Notebook" />
        </SelectTrigger>
        <SelectContent>
          {notebooks.map((notebook) => (
            <SelectItem
              key={notebook.id}
              value={notebook.id!}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: notebook.color }}
              />
              {notebook.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Notebook Title"
                value={newNotebook.title}
                onChange={(e) =>
                  setNewNotebook((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <Input
                placeholder="Description (optional)"
                value={newNotebook.description}
                onChange={(e) =>
                  setNewNotebook((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div>
              <Input
                type="color"
                value={newNotebook.color}
                onChange={(e) =>
                  setNewNotebook((prev) => ({ ...prev, color: e.target.value }))
                }
                className="h-10 p-1"
              />
            </div>
            <Button
              onClick={handleCreateNotebook}
              disabled={!newNotebook.title}
              className="w-full"
            >
              Create Notebook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
