import API from "@/lib/api";

interface DeleteProjectPayload {
  workspaceId: string;
  projectId: string;
}

const deleteProjectMutationFn = async ({ workspaceId, projectId }: DeleteProjectPayload) => {
  const response = await API.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  return response.data;
};

export default deleteProjectMutationFn;
