import API from "./api";

export const createProjectMutationFn = async (data: {
  workspaceId: string;
  name: string;
  description: string;
}) => {
  const response = await API.post(`/workspaces/${data.workspaceId}/projects`, data);
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const response = await API.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  return response.data;
};
