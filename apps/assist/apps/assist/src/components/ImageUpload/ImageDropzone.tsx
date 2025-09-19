
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { uploadImage, UploadProgress } from "@/services/storage";

interface ImageDropzoneProps {
  folder: string;
  onUploadComplete: (url: string) => void;
}

export function ImageDropzone({ folder, onUploadComplete }: ImageDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ progress: 0 });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadImage(file, folder, (progress) => {
          setUploadProgress(progress);
          if (progress.downloadUrl) {
            onUploadComplete(progress.downloadUrl);
          }
        });
      });
    },
    [folder, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"]
    },
    multiple: false
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-8 text-center border-2 border-dashed cursor-pointer ${
        isDragActive ? "border-primary" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div>
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p>Drag & drop an image here, or click to select</p>
          )}
        </div>
        {uploadProgress.progress > 0 && (
          <Progress value={uploadProgress.progress} className="w-full" />
        )}
        {uploadProgress.error && (
          <p className="text-red-500">{uploadProgress.error}</p>
        )}
      </div>
    </Card>
  );
}
