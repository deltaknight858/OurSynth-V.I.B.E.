
import { db } from "@/lib/firebase";
import { DatabaseService } from "./database";
import type { Workflow, WorkflowTemplate, WorkflowVersion } from "@/types/database";
import {
  query,
  where,
  orderBy,
  QueryConstraint,
  DocumentSnapshot,
  Timestamp,
  collection,
  getDocs,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint
} from "firebase/firestore";

class WorkflowService extends DatabaseService<Workflow> {
  constructor() {
    super("workflows");
  }

  async getByUser(userId: string, options?: {
    status?: "draft" | "active" | "archived";
    pageSize?: number;
    startAfter?: DocumentSnapshot<Workflow>;
  }): Promise<Workflow[]> {
    const constraints: (QueryFieldFilterConstraint | QueryOrderByConstraint)[] = [
      where("createdBy", "==", userId),
      orderBy("updatedAt", "desc")
    ];

    if (options?.status) {
      constraints.push(where("status", "==", options.status));
    }

    return this.list({
      filters: constraints,
      startAfterDoc: options?.startAfter,
      pageSize: options?.pageSize
    });
  }

  async getSharedWithUser(userId: string): Promise<Workflow[]> {
    return this.list({
      filters: [
        where("collaborators", "array-contains", { userId: userId }),
        where("status", "==", "active")
      ],
      orderByField: "updatedAt"
    });
  }

  async createVersion(workflowId: string, version: number, userId: string): Promise<void> {
    const workflow = await this.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const currentVersion = workflow.versions.find(v => v.version === workflow.currentVersion);
    if (!currentVersion) throw new Error("Current version not found");

    const newVersion: WorkflowVersion = {
      ...currentVersion,
      version,
      createdAt: Timestamp.now(),
      createdBy: userId
    };

    await this.update(workflowId, {
      versions: [...workflow.versions, newVersion],
      currentVersion: version
    });
  }
}

class WorkflowTemplateService extends DatabaseService<WorkflowTemplate> {
  constructor() {
    super("workflowTemplates");
  }

  async getPublicTemplates(category?: string): Promise<WorkflowTemplate[]> {
    const constraints: (QueryFieldFilterConstraint | QueryOrderByConstraint)[] = [
      where("isPublic", "==", true),
      orderBy("usageCount", "desc")
    ];

    if (category) {
      constraints.push(where("category", "==", category));
    }

    return this.list({
      filters: constraints,
      pageSize: 20
    });
  }

  async incrementUsageCount(templateId: string): Promise<void> {
    const template = await this.get(templateId);
    if (!template) throw new Error("Template not found");

    await this.update(templateId, {
      usageCount: (template.usageCount || 0) + 1
    });
  }
}

export const workflowService = new WorkflowService();
export const workflowTemplateService = new WorkflowTemplateService();
