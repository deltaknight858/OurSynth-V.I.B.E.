// De-Firebase: storage API stubs. Implement with your storage provider (e.g., S3, Cloudflare R2) later.

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export const uploadImage = (
  _file: File,
  _folder: string,
  _onProgress: (progress: UploadProgress) => void
) => {
  throw new Error("Firebase removed: implement uploadImage with your storage provider.");
};

export const listImages = async (_folder: string) => {
  throw new Error("Firebase removed: implement listImages with your storage provider.");
};

export const deleteImage = async (_path: string) => {
  throw new Error("Firebase removed: implement deleteImage with your storage provider.");
};
