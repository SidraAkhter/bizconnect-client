import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";
import { useAuthStore } from "@/store/auth-store";

const AuthRoute = () => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const _isAuthRoute = isAuthRoute(location.pathname);

  // Show loading while auth is being checked (except on auth routes)
  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  // If not authenticated, show the auth page (sign-in/sign-up)
  if (!isAuthenticated && !user) return <Outlet />;

  // If authenticated, determine where to redirect
  let redirectPath = "/workspace";
  
  if (user?.currentWorkspace) {
    // Handle different formats of currentWorkspace
    if (typeof user.currentWorkspace === 'object' && user.currentWorkspace._id) {
      redirectPath = `/workspace/${user.currentWorkspace._id}`;
    } else if (user.currentWorkspace) {
      redirectPath = `/workspace/${user.currentWorkspace}`;
    }
    console.log("AuthRoute: Redirecting to:", redirectPath);
  } else {
    console.log("AuthRoute: No workspace found, redirecting to workspaces list");
  }

  // Single return point for all redirects
  return <Navigate to={redirectPath} replace />;
};

export default AuthRoute;
