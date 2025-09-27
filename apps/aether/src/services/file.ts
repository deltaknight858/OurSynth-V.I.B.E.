
import { db, storage } from "@/lib/firebase";
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { fileMetadataService } from "./database";
import type { FileMetadata } from "@/types/database";
import { Timestamp, where } from "firebase/firestore";

interface FileUploadResult {
  metadata: FileMetadata;
  downloadUrl: string;
}

export class FileService {
  async listFiles(workflowId: string, path: string = ""): Promise<FileMetadata[]> {
    const files = await fileMetadataService.list({
      filters: [
        where("workflowId", "==", workflowId),
        where("path", "==", path),
        where("isDeleted", "==", false)
      ],
      orderByField: "name"
    });
    return files;
  }

  async uploadFile(
    file: File,
    workflowId: string,
    path: string = "",
    userId: string
  ): Promise<FileUploadResult> {
    const timestamp = Timestamp.now();
    const fileId = crypto.randomUUID();
    const storageRef = ref(storage, `workflows/${workflowId}/${path}/${file.name}`);
    
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    const metadata: FileMetadata = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      path: `${path}/${file.name}`.replace(/^\/+/, ""),
      workflowId,
      uploadedBy: userId,
      uploadedAt: timestamp,
      lastModified: timestamp,
      isDeleted: false
    };

    await fileMetadataService.create(fileId, metadata);

    return {
      metadata,
      downloadUrl
    };
  }

  async createFolder(
    workflowId: string,
    path: string,
    folderName: string,
    userId: string
  ): Promise<FileMetadata> {
    const timestamp = Timestamp.now();
    const folderId = crypto.randomUUID();
    const fullPath = path ? `${path}/${folderName}` : folderName;

    const metadata: FileMetadata = {
      id: folderId,
      name: folderName,
      type: "folder",
      size: 0,
      path: fullPath.replace(/^\/+/, ""),
      workflowId,
      uploadedBy: userId,
      uploadedAt: timestamp,
      lastModified: timestamp,
      isDeleted: false
    };

    await fileMetadataService.create(folderId, metadata);
    return metadata;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await fileMetadataService.get(fileId);
    if (!file) throw new Error("File not found");

    if (file.type !== "folder") {
      const storageRef = ref(storage, `workflows/${file.workflowId}/${file.path}`);
      await deleteObject(storageRef);
    }
    
    await fileMetadataService.update(fileId, {
      isDeleted: true,
      lastModified: Timestamp.now()
    });
  }

  async getDownloadUrl(workflowId: string, path: string): Promise<string> {
    const storageRef = ref(storage, `workflows/${workflowId}/${path}`);
    return getDownloadURL(storageRef);
  }
}

export const fileService = new FileService();
