
import { useState, useEffect } from "react";
import { ImageDropzone } from "./ImageDropzone";
import { ImageGallery } from "./ImageGallery";
import { listImages } from "@/services/storage";

interface ImageUploadSectionProps {
  folder: string;
}

export function ImageUploadSection({ folder }: ImageUploadSectionProps) {
  const [images, setImages] = useState<Array<{
    name: string;
    url: string;
    path: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const imageList = await listImages(folder);
      setImages(imageList);
      setError(null);
    } catch (err) {
      setError("Failed to load images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [folder]);

  const handleUploadComplete = (url: string) => {
    loadImages();
  };

  const handleImageDelete = (path: string) => {
    setImages((prev) => prev.filter((img) => img.path !== path));
  };

  return (
    <div className="space-y-8">
      <ImageDropzone folder={folder} onUploadComplete={handleUploadComplete} />
      
      {error && <p className="text-red-500">{error}</p>}
      
      {loading ? (
        <div className="text-center">Loading images...</div>
      ) : (
        <ImageGallery images={images} onImageDelete={handleImageDelete} />
      )}
    </div>
  );
}
