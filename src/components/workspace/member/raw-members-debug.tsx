import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import API from "@/lib/axios-client";
import useWorkspaceId from "@/hooks/use-workspace-id";

// Component to directly fetch and display all members in the workspace
// bypassing React Query and any potential population issues
export function RawMembersDebug() {
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Direct API call to fetch members
  const fetchRawMembers = async () => {
    setLoading(true);
    try {
      console.log("Direct API call to fetch members for workspace:", workspaceId);
      
      // First check the members endpoint
      const membersResponse = await API.get(`/workspace/members/${workspaceId}`);
      console.log("Raw members endpoint response:", membersResponse.data);
      
      // Then also check the workspace endpoint to see if it includes members
      const workspaceResponse = await API.get(`/workspace/${workspaceId}`);
      console.log("Raw workspace endpoint response:", workspaceResponse.data);
      
      // Get members from both sources
      const membersFromMembersApi = membersResponse.data?.members || [];
      const membersFromWorkspaceApi = workspaceResponse.data?.workspace?.members || [];
      
      console.log("Members from members API:", membersFromMembersApi.length);
      console.log("Members from workspace API:", membersFromWorkspaceApi.length);
      
      // Store the members from the members API
      setMembers(membersFromMembersApi);
      
      toast({
        title: "Raw Members Data Fetched",
        description: `Found ${membersFromMembersApi.length} members via members API and ${membersFromWorkspaceApi.length} via workspace API`
      });
    } catch (error) {
      console.error("Error fetching raw members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch raw members data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => {
            setIsOpen(true);
            fetchRawMembers();
          }}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Raw Members Debug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raw Members Data (Direct API Call)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : members.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No members found in direct API call
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                Found {members.length} members via direct API call
              </div>
              {members.map((member, index) => (
                <div key={member._id || index} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Member {index + 1}</div>
                      <div className="text-xs text-gray-500">ID: {member._id}</div>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {typeof member.role === 'object' ? 
                        member.role.name : 
                        typeof member.role === 'string' ? 
                          member.role : 'Unknown Role'}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <div>
                      <span className="font-medium">User ID:</span>{' '}
                      {typeof member.userId === 'object' ? 
                        (member.userId._id || 'No ID') : 
                        typeof member.userId === 'string' ? 
                          member.userId : 'Unknown User'}
                    </div>
                    {typeof member.userId === 'object' && (
                      <>
                        <div>
                          <span className="font-medium">Name:</span> {member.userId.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {member.userId.email || 'N/A'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Joined:</span>{' '}
                      {member.joinedAt ? 
                        new Date(member.joinedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {member.createdAt ? 
                        new Date(member.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">userId type:</span>{' '}
                      {typeof member.userId}
                    </div>
                    <div>
                      <span className="font-medium">role type:</span>{' '}
                      {typeof member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            disabled={loading}
            onClick={fetchRawMembers}
          >
            {loading && <RefreshCw className="h-4 w-4 mr-1 animate-spin" />}
            Refresh Data
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 