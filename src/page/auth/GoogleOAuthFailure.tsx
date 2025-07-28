import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const GoogleOAuthFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
           ConnectCircle.
        </Link>
        <div className="flex flex-col gap-6"></div>
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
            <p className="mb-4">We couldn't sign you in with Google. Please try again.</p>

            {(status || error) && (
              <div className="p-4 bg-gray-100 rounded-lg mb-4 text-left">
                {status && <p><strong>Status:</strong> {status}</p>}
                {error && <p><strong>Error:</strong> {error}</p>}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={() => navigate("/")}>
              Back to Login
            </Button>
              <Button variant="outline" onClick={() => navigate("/auth-debug")}>
                Debug Authentication
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthFailure;
