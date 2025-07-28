import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const { data, isPending, isError, isRefetching } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];
  
  // Add more debugging info
  useEffect(() => {
    console.log("RecentMembers - Workspace ID:", workspaceId);
    console.log("RecentMembers - Members data:", data);
    console.log("RecentMembers - Members count:", members.length);
    
    if (data && (!data.members || data.members.length === 0)) {
      console.log("RecentMembers - No members found for this workspace");
    } else if (data && data.members && data.members.length > 0) {
      console.log("RecentMembers - Found members:", data.members);
      
      // Debug each member to check for potential issues
      data.members.forEach((member, index) => {
        console.log(`Member ${index + 1}:`, member);
        
        // Check if member has required properties for rendering
        if (!member.userId) {
          console.error(`Member ${index + 1} is missing userId property`);
        } else if (typeof member.userId === 'string') {
          console.error(`Member ${index + 1} has userId as string (${member.userId}) instead of an object - this will cause rendering issues`);
        }
        
        if (!member.role) {
          console.error(`Member ${index + 1} is missing role property`);
        } else if (typeof member.role === 'string') {
          console.error(`Member ${index + 1} has role as string (${member.role}) instead of an object - this will cause rendering issues`);
        }
      });
    }
    
    if (isError) {
      console.error("RecentMembers - Error fetching members");
    }
  }, [data, workspaceId, members.length, isError]);
  
  // Function to force refresh the members list
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["members", workspaceId],
    });
  };

  return (
    <div className="flex flex-col pt-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-500">
          Members ({members.length})
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log("Raw members data:", data);
              if (data?.members) {
                data.members.forEach((member, i) => {
                  console.log(`Member ${i+1}:`, member);
                  console.log(`Member ${i+1} userId type:`, typeof member.userId);
                  console.log(`Member ${i+1} role type:`, typeof member.role);
                });
              }
              toast({
                title: "Debug info",
                description: `Members data logged to console. Found ${members.length} members.`,
              });
            }}
            className="text-xs"
          >
            Debug
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isPending || isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {(isPending || isRefetching) ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading members. Please try refreshing.
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No members found in this workspace.
        </div>
      ) : (
        <ul role="list" className="space-y-3">
          {members.map((member, index) => {
            // Handle both string and object references for userId and role
            let userName = "";
            let profilePicture = "";
            let roleName = "";
            
            // Handle userId which might be a string or object
            if (member.userId) {
              if (typeof member.userId === 'object') {
                userName = member.userId.name || "";
                profilePicture = member.userId.profilePicture || "";
              } else {
                // If userId is a string, we can't extract name directly
                // This is a fallback case
                userName = "User";
                profilePicture = "";
              }
            }
            
            // Handle role which might be a string or object
            if (member.role) {
              if (typeof member.role === 'object') {
                roleName = member.role.name || "";
              } else {
                // If role is a string, we can't extract name directly
                roleName = "Member";
              }
            }
            
            const initials = getAvatarFallbackText(userName);
            const avatarColor = getAvatarColor(userName);
            
            return (
              <li
                key={member._id || index}
                role="listitem"
                className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-9 w-9 sm:flex">
                    <AvatarImage
                      src={profilePicture}
                      alt="Avatar"
                    />
                    <AvatarFallback className={avatarColor}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Member Details */}
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
                  <p className="text-sm text-gray-500">{roleName}</p>
                </div>

                {/* Joined Date */}
                <div className="ml-auto text-sm text-gray-500">
                  <p>Joined</p>
                  <p>{member.joinedAt ? format(new Date(member.joinedAt), "PPP") : null}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentMembers;
