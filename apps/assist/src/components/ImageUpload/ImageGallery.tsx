
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteImage } from "@/services/storage";

interface ImageGalleryProps {
  images: Array<{
    name: string;
    url: string;
    path: string;
  }>;
  onImageDelete: (path: string) => void;
}

export function ImageGallery({ images, onImageDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = async (path: string) => {
    try {
      await deleteImage(path);
      onImageDelete(path);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.path} className="group relative overflow-hidden">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setSelectedImage(image.url)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                className="absolute top-2 right-2 h-9 w-9 inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(image.path);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
