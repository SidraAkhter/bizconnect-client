import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import useAuth from "./use-auth";
import { useEffect } from "react";

const useWorkspaceCheck = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { data: authData } = useAuth();
  const userId = authData?.user?._id;

  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId as string),
    enabled: !!workspaceId && !!userId,
    retry: 1,
  });

  useEffect(() => {
    if (query.isError) {
      toast({
        title: "Workspace Error",
        description: "Could not access this workspace",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [query.isError, navigate]);

  return query;
};

export default useWorkspaceCheck; 