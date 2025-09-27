import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDeployBranches } from "@/hooks/useDeployBranches";
import { useDeployments } from "@/hooks/useDeployments";

const formSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required." }),
  repoUrl: z.string().url({ message: "Please enter a valid URL." }).refine(
    (url) => url.startsWith("https://"),
    { message: "URL must start with https://" }
  ),
  branch: z.string({
    required_error: "Please select a branch to deploy.",
  }),
  buildCommand: z.string().default("npm run build"),
  enablePreviewUrl: z.boolean().default(true),
});

type DeployFormValues = z.infer<typeof formSchema>;

interface NewDeployModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function NewDeployModal({ isOpen, onOpenChange }: NewDeployModalProps) {
  const form = useForm<DeployFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      buildCommand: "npm run build",
      enablePreviewUrl: true,
    },
  });

  const repoUrlValue = form.watch("repoUrl");
  const { branches, loading: isLoadingBranches } = useDeployBranches(repoUrlValue);
  const { create: createDeployment, loading: isDeploying } = useDeployments();

  const onSubmit = async (data: DeployFormValues) => {
    try {
      await createDeployment({
        repoUrl: data.repoUrl,
        projectName: data.projectName,
        branch: data.branch,
        commands: data.buildCommand,
        preview: data.enablePreviewUrl,
      });
      onOpenChange(false);
      form.reset();
<<<<<<< HEAD
    } catch (error) {
      console.error("Deployment failed", error);
      // Toast notification is handled within the useDeployments hook
=======
    } catch {
      // Error handling is managed by the useDeployments hook with proper toast notifications
      // Silently fail here as user feedback is already handled
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-background/80 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle>Launch New Deployment</DialogTitle>
          <DialogDescription>
<<<<<<< HEAD
            Configure your new deployment. Click deploy when you're ready.
=======
            Configure your new deployment. Click deploy when you&apos;re ready.
>>>>>>> 4feaadea468fca2b13cf09955b1eec9f1acc2214
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., my-awesome-site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Git Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoadingBranches || !repoUrlValue || branches.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select a branch"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildCommand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Commands</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., npm install && npm run build"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The commands to build your application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enablePreviewUrl"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Preview URL
                    </FormLabel>
                    <FormDescription>
                      A unique URL will be generated for this deployment.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isDeploying || !form.formState.isValid}
                className="relative overflow-hidden w-full sm:w-auto bg-black/20 backdrop-blur-sm text-white
                           border border-cyan-300/50 
                           shadow-[0_0_8px_rgba(0,255,255,0.3),inset_0_0_8px_rgba(0,255,255,0.3)]
                           hover:border-cyan-300/80 hover:shadow-[0_0_15px_rgba(0,255,255,0.5),inset_0_0_15px_rgba(0,255,255,0.5)]
                           transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-background
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:border-gray-500/50"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  "Launch Deployment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewDeployModal;
    
