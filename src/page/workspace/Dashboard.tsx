import { Plus, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";
import { RawMembersDebug } from "@/components/workspace/member/raw-members-debug";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/api/use-auth";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";
import ChatModal from "@/components/chat/ChatModal";
import { socket } from "@/lib/socket";

// ✅ Type for incoming message
type ChatMessage = {
  content: string;
  senderId: string;
  workspaceId: string;
  timestamp?: string;
};

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { data: authData } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("projects");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Handle incoming chat message
  const handleNewMessage = (message: ChatMessage) => {
    if (!isChatOpen && message.workspaceId === workspaceId) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  // ✅ Setup socket listener
  useEffect(() => {
    if (!workspaceId) return;

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [isChatOpen, workspaceId]);

  const refreshAllData = () => {
    if (!workspaceId) return;
    queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
    queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
    toast({
      title: "Refreshing data",
      description: "Workspace data is being refreshed",
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (!workspaceId || workspaceId === "undefined") {
      const current = authData?.user?.currentWorkspace;
      const id = typeof current === "object" && current?._id ? current._id : current;
      if (id) {
        navigate(`/workspace/${id}`, { replace: true });
      } else {
        navigate("/workspace", { replace: true });
      }
    }
  }, [authData, workspaceId, navigate]);

  const enabled = !!workspaceId && workspaceId !== "undefined" && isAuthenticated;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId as string),
    enabled,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        document.cookie =
          "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        navigate("/", { replace: true });
        return;
      }
      if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have access to this workspace",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
    }
    if (error) {
      toast({
        title: "Error loading workspace",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  }, [error, navigate]);

  useEffect(() => {
    if (workspaceId && authData?.user && !isLoading && !data && !error) {
      refetch();
    }
  }, [workspaceId, authData, isLoading, data, error, refetch]);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    if (!isLoading && !data && !error && workspaceId && workspaceId !== "undefined") {
      retryTimeout = setTimeout(() => {
        refetch();
      }, 2000);
    }
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [isLoading, data, error, workspaceId, refetch]);

  if (workspaceId === "undefined" || isLoading) return <DashboardSkeleton />;

  if ((error || !data) && isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-2xl font-bold mb-4">Error loading workspace</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error
            ? `Error: ${error.message}`
            : "There was a problem loading your workspace data"}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => refetch()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/workspace")}>
            View All Workspaces
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {data?.workspace?.name || "Workspace Overview"}
          </h2>
          <p className="text-muted-foreground">
            Here's an overview for this workspace!
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshAllData}
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="relative flex items-center gap-1"
            onClick={() => {
              setIsChatOpen(true);
              setUnreadCount(0);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Chat
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button onClick={onOpen}>
            <Plus /> New Project
          </Button>
        </div>
      </div>

      <WorkspaceAnalytics />

      <div className="mt-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full border rounded-lg p-2"
        >
          <TabsList className="w-full justify-start border-0 bg-gray-50 px-1 h-12">
            <TabsTrigger className="py-2" value="projects">
              Recent Projects
            </TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger className="py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members">
            {activeTab === "members" && (
              <div className="mb-3 flex justify-end gap-2">
                <RawMembersDebug />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    queryClient.removeQueries({ queryKey: ["members", workspaceId] });
                    queryClient.fetchQuery({ queryKey: ["members", workspaceId] });
                    toast({
                      title: "Refreshing Members",
                      description: "Fetching the latest member data from the server",
                    });
                  }}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Force Refresh Members
                </Button>
              </div>
            )}
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        workspaceId={workspaceId as string}
      />
    </main>
  );
};

export default WorkspaceDashboard;
