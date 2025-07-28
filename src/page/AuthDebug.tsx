import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useAuth, { isAuthenticated } from "@/hooks/api/use-auth";

// Helper to get all cookies
const getAllCookies = () => {
  const cookieObj: Record<string, string> = {};
  document.cookie.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key) cookieObj[key] = value;
  });
  return cookieObj;
};

const AuthDebugPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const { data: authData, isLoading, isError, error } = useAuth();
  
  useEffect(() => {
    // Get all cookies on mount
    setCookies(getAllCookies());
    
    // Update cookies periodically
    const interval = setInterval(() => {
      setCookies(getAllCookies());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const clearAllCookies = () => {
    const allCookies = document.cookie.split(';');
    
    // For each cookie, set its expiration date to the past
    allCookies.forEach(cookie => {
      const [key] = cookie.trim().split('=');
      if (key) {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });
    
    // Update the cookie state
    setCookies({});
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="grid gap-6">
        <section className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
          <p className="mb-1">
            <span className="font-medium">Is Authenticated:</span>{" "}
            <span className={isAuthenticated() ? "text-green-600" : "text-red-600"}>
              {isAuthenticated() ? "Yes" : "No"}
            </span>
          </p>
          <p className="mb-1">
            <span className="font-medium">Auth Loading:</span>{" "}
            {isLoading ? "Yes" : "No"}
          </p>
          <p className="mb-1">
            <span className="font-medium">Auth Error:</span>{" "}
            <span className={isError ? "text-red-600" : "text-green-600"}>
              {isError ? "Yes" : "No"}
            </span>
          </p>
          {isError && (
            <div className="mt-2 p-3 bg-red-50 rounded-md text-red-800 text-sm">
              <p className="font-medium">Error Details:</p>
              <pre className="whitespace-pre-wrap mt-1">
                {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
        </section>
        
        <section className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">User Data</h2>
          {authData?.user ? (
            <div className="overflow-x-auto">
              <p className="mb-1">
                <span className="font-medium">User ID:</span> {authData.user._id}
              </p>
              <p className="mb-1">
                <span className="font-medium">Name:</span> {authData.user.name}
              </p>
              <p className="mb-1">
                <span className="font-medium">Email:</span> {authData.user.email}
              </p>
              <p className="mb-1">
                <span className="font-medium">Current Workspace:</span>{" "}
                {typeof authData.user.currentWorkspace === 'object' 
                  ? authData.user.currentWorkspace?._id
                  : authData.user.currentWorkspace}
              </p>
              <div className="mt-3">
                <p className="font-medium mb-1">Full User Object:</p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(authData.user, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No user data available</p>
          )}
        </section>
        
        <section className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">Browser Cookies</h2>
          {Object.keys(cookies).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(cookies).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-md">
                        {key === 'auth_user' ? '(Auth cookie - value hidden)' : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No cookies found</p>
          )}
        </section>
        
        <div className="flex gap-4 mt-4">
          <Button onClick={clearAllCookies} variant="destructive">
            Clear All Cookies
          </Button>
          <Button onClick={() => navigate("/")}>
            Go to Home Page
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPage; 