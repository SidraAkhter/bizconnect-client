import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const InviteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const param = useParams();
  const inviteCode = param.inviteCode as string;
  
  // Log for debugging
  useEffect(() => {
    console.log("Invite code from URL:", inviteCode);
  }, [inviteCode]);

  const { data: authData, isPending: isAuthLoading } = useAuth();
  const user = authData?.user;

  const { mutate, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  // Display the error message from the mutation
  useEffect(() => {
    if (mutationError) {
      // @ts-ignore - error has message property
      const errorMsg = mutationError.message || "Failed to join workspace";
      setErrorMessage(errorMsg);
      console.error("Workspace join error:", mutationError);
    }
  }, [mutationError]);

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Additional validation
    if (!inviteCode) {
      setErrorMessage("Invalid invitation code");
      return;
    }
    
    console.log("Attempting to join workspace with code:", inviteCode);
    
    mutate(inviteCode, {
      onSuccess: (data) => {
        console.log("Successfully joined workspace:", data);
        
        // Force invalidation of multiple queries to ensure data is refreshed
        // First, invalidate workspace queries
        queryClient.invalidateQueries({
          queryKey: ["userWorkspaces"],
        });
        
        // Invalidate members query for this specific workspace
        queryClient.invalidateQueries({
          queryKey: ["members", data.workspaceId],
        });
        
        // Invalidate the workspace data itself
        queryClient.invalidateQueries({
          queryKey: ["workspace", data.workspaceId],
        });
        
        // Force an immediate refetch of the members
        queryClient.fetchQuery({
          queryKey: ["members", data.workspaceId],
        });
        
        // Wait a moment to make sure data has time to refresh
        setTimeout(() => {
          toast({
            title: "Success!",
            description: "You've successfully joined the workspace.",
          });
          
          // Navigate to the workspace
          navigate(`/workspace/${data.workspaceId}`);
        }, 500);
      },
      onError: (error) => {
        console.error("Error joining workspace:", error);
        // @ts-ignore - error has message property
        const msg = error.message || "Failed to join workspace. Please try again.";
        setErrorMessage(msg);
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          ConnectCircle.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Hey there! You're invited to join a TeamSync Workspace!
              </CardTitle>
              <CardDescription>
                Looks like you need to be logged into your TeamSync account to
                join this Workspace.
              </CardDescription>
              {errorMessage && (
                <div className="mt-2 p-2 text-sm bg-red-50 text-red-600 rounded border border-red-200">
                  {errorMessage}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isAuthLoading ? (
                <Loader className="!w-11 !h-11 animate-spin place-self-center flex mx-auto" />
              ) : (
                <div>
                  {user ? (
                    <div className="flex flex-col items-center justify-center my-3 gap-3">
                      <p className="text-sm text-slate-600">
                        Invitation Code: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{inviteCode}</span>
                      </p>
                      <form onSubmit={handleSubmit}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="!bg-green-500 !text-white text-[23px] !h-auto"
                        >
                          {isLoading && (
                            <Loader className="!w-6 !h-6 animate-spin mr-2" />
                          )}
                          Join the Workspace
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p className="text-center text-sm text-slate-600">
                        Sign in or create an account to join this workspace
                      </p>
                      <div className="flex flex-col md:flex-row items-center gap-2">
                        <Link
                          className="flex-1 w-full text-base"
                          to={`/sign-up?returnUrl=${returnUrl}`}
                        >
                          <Button className="w-full">Signup</Button>
                        </Link>
                        <Link
                          className="flex-1 w-full text-base"
                          to={`/?returnUrl=${returnUrl}`}
                        >
                          <Button variant="secondary" className="w-full border">
                            Login
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
