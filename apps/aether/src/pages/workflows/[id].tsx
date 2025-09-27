
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { WorkflowEditor } from "@/components/workflow/WorkflowEditor";
import { WorkflowProvider } from "@/components/workflow/WorkflowProvider";
import { workflowService } from "@/services/workflow";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Workflow, WorkflowNode, WorkflowConnection, WorkflowVersion } from "@/types/database";
import { Loader2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function WorkflowPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkflow() {
      if (!id || !user) return;

      try {
        setLoading(true);
        setError(null);
        const workflowData = await workflowService.get(id as string);
        
        if (!workflowData) {
          setError("Workflow not found");
          return;
        }

        if (workflowData.createdBy !== user.uid && 
            !workflowData.collaborators?.some(c => c.userId === user.uid)) {
          setError("You don't have access to this workflow");
          return;
        }

        setWorkflow(workflowData);
      } catch (error) {
        setError("Failed to load workflow");
        console.error("Load workflow error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkflow();
  }, [id, user]);

  const handleSave = async (nodes: WorkflowNode[], connections: WorkflowConnection[]) => {
    if (!workflow || !user) return;

    try {
      const currentVersion = workflow.currentVersion || 1;
      const updatedVersion: WorkflowVersion = {
        version: currentVersion,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
        nodes,
        connections,
        metadata: {
          description: workflow.description,
          tags: workflow.tags
        }
      };

      const versions = workflow.versions.filter(v => v.version !== currentVersion);
      
      await workflowService.update(workflow.id, {
        versions: [...versions, updatedVersion],
        currentVersion
      });

      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    } catch (error) {
      console.error("Save workflow error:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">{error}</h2>
          <button
            className="mt-4 text-primary hover:underline"
            onClick={() => router.push("/workflows")}
          >
            Back to Workflows
          </button>
        </div>
      </div>
    );
  }

  if (!workflow) return null;

  const currentVersion = workflow.versions.find(v => v.version === workflow.currentVersion);

  return (
    <WorkflowProvider>
      <WorkflowEditor
        workflowId={workflow.id}
        initialNodes={currentVersion?.nodes || []}
        initialConnections={currentVersion?.connections || []}
        onSave={handleSave}
      />
    </WorkflowProvider>
  );
}
