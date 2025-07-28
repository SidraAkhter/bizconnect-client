import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";

const WorkspaceEmptyState = () => {
  const { onOpen } = useCreateWorkspaceDialog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasWorkspaces, setHasWorkspaces] = useState(false);

  useEffect(() => {
    const checkExistingWorkspaces = async () => {
      try {
        setLoading(true);
        const result = await getAllWorkspacesUserIsMemberQueryFn();
        console.log("Workspaces found:", result.workspaces);
        
        if (result.workspaces && result.workspaces.length > 0) {
          // If workspaces exist, navigate to the first one
          const firstWorkspace = result.workspaces[0];
          const workspaceId = firstWorkspace._id;
          console.log("Navigating to first workspace:", workspaceId);
          navigate(`/workspace/${workspaceId}`);
          setHasWorkspaces(true);
        } else {
          setHasWorkspaces(false);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        toast({
          title: "Error",
          description: "Failed to load your workspaces",
          variant: "destructive",
        });
        setHasWorkspaces(false);
      } finally {
        setLoading(false);
      }
    };

    checkExistingWorkspaces();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <p className="text-muted-foreground">Checking your workspaces...</p>
      </div>
    );
  }

  if (hasWorkspaces) {
    return null; // We're navigating away, no need to render anything
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center">
        <div className="rounded-full bg-muted p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground"
          >
            <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
            <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
            <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
            <path d="M22 9c-4.29 1.33-7.12 2.67-12 0" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">No workspaces found</h2>
          <p className="mt-2 text-muted-foreground">
            You don't have any workspaces yet. Create your first workspace to get started.
          </p>
        </div>
        <Button size="lg" onClick={onOpen}>
          Create Workspace
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceEmptyState; 