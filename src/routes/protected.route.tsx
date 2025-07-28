import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

const ProtectedRoute = () => {
  const { isAuthenticated, user, isLoading, error } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue",
        variant: "destructive",
      });
    }
  }, [error]);

  // If authenticated, allow access immediately
  if (isAuthenticated) {
    return <Outlet />;
  }
  
  // If still loading, show loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  // If we have a user from the store, allow access
  if (user) {
    return <Outlet />;
  }
  
  // Otherwise redirect to login
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute;
