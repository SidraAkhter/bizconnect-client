import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { logoutMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const [isLogoutFailed, setIsLogoutFailed] = useState(false);
  const logout = useAuthStore(state => state.logout);

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      console.log("Logout API call succeeded");
      // Close dialog and let auth store handle the logout process
      setIsOpen(false);
      logout();
    },
    onError: (error) => {
      console.error("Logout API call failed:", error);
      setIsLogoutFailed(true);
      
      toast({
        title: "Logout Warning",
        description: "Could not reach the server. You've been logged out locally.",
        variant: "destructive",
      });
      
      // Even on error, perform client-side logout via the auth store
      setIsOpen(false);
      logout();
    },
  });

  // Handle logout action
  const handleLogout = useCallback(() => {
    if (isPending) return;
    console.log("Logging out...");
    
    // Set a fallback timer in case the server request takes too long
    const fallbackTimer = setTimeout(() => {
      if (!isLogoutFailed) {
        console.log("Logout request taking too long, triggering client-side fallback");
        setIsLogoutFailed(true);
        
        toast({
          title: "Logout Warning",
          description: "Server response delayed. You've been logged out locally.",
          variant: "destructive",
        });
        
        // Close dialog and logout via the auth store
        setIsOpen(false);
        logout();
      }
    }, 2000); // Shorter timeout
    
    // Make the logout API call
    mutate(undefined, {
      onSettled: () => {
        // Clear the fallback timer when the API call settles (success or error)
        clearTimeout(fallbackTimer);
      }
    });
  }, [isPending, mutate, isLogoutFailed, setIsOpen, logout]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will end your current session and you will need to log in
              again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="animate-spin" />}
              Sign out
            </Button>
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
