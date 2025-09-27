
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { FileMetadata } from "@/types/database";
import { fileService } from "@/services/file";
import { File, Folder, Upload, Loader2, FolderPlus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FilePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
  onSelect: (path: string) => void;
  mode: "file" | "folder";
  title?: string;
}

export function FilePickerDialog({
  open,
  onOpenChange,
  workflowId,
  onSelect,
  mode,
  title = "Select a File"
}: FilePickerDialogProps) {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileMetadata | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const fileList = await fileService.listFiles(workflowId, currentPath);
      setFiles(fileList);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  }, [workflowId, currentPath]);

  useEffect(() => {
    if (open) {
      loadFiles();
    }
  }, [open, loadFiles]);

  const handleSelect = (file: FileMetadata) => {
    if (mode === "file" && file.type === "folder") {
      setCurrentPath(file.path);
      return;
    }
    onSelect(file.path);
    onOpenChange(false);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length || !user) return;

    try {
      setUploading(true);
      const file = files[0];
      await fileService.uploadFile(file, workflowId, currentPath, user.uid);
      await loadFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateFolder = async () => {
    if (!user || !newFolderName.trim()) return;

    try {
      setCreating(true);
      await fileService.createFolder(workflowId, currentPath, newFolderName.trim(), user.uid);
      await loadFiles();
      setCreateFolderOpen(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, file: FileMetadata) => {
    e.stopPropagation();
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      setDeleting(true);
      await fileService.deleteFile(fileToDelete.id);
      await loadFiles();
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload File
            </Button>
            <Button
              variant="outline"
              onClick={() => setCreateFolderOpen(true)}
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FolderPlus className="mr-2 h-4 w-4" />
              )}
              New Folder
            </Button>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {currentPath && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate(currentPath.split("/").slice(0, -1).join("/"))}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    ..
                  </Button>
                )}
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 group">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleSelect(file)}
                    >
                      {file.type === "folder" ? (
                        <Folder className="mr-2 h-4 w-4" />
                      ) : (
                        <File className="mr-2 h-4 w-4" />
                      )}
                      {file.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(e, file)}
                      aria-label={`Delete ${file.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for the new folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || creating}
            >
              {creating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {fileToDelete?.type === "folder" ? "Folder" : "File"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{fileToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
