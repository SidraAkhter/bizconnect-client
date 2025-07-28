import { getMembersInWorkspaceQueryFn } from "@/lib/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { CustomError } from "@/types/custom-error.type";
import { AllMembersInWorkspaceResponseType } from "@/types/api.type";

const useGetWorkspaceMembers = (
  workspaceId: string, 
  options?: Omit<UseQueryOptions<AllMembersInWorkspaceResponseType, CustomError, AllMembersInWorkspaceResponseType, (string | undefined)[]>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
    refetchInterval: 10000, // Refresh every 10 seconds
    refetchOnWindowFocus: true, // Refresh when tab gains focus
    staleTime: 0, // Data is always stale immediately
    gcTime: 5000, // Only cache for 5 seconds (garbage collection time)
    refetchOnMount: "always", // Always refetch when component mounts
    ...options
  });
  return query;
};

export default useGetWorkspaceMembers;
