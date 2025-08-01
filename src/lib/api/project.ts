import API from "./api";

export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { name: string; description: string; emoji: string };
}) => {
  const response = await API.post(`/workspaces/${workspaceId}/projects`, data);
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

export const editProjectMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  data: { name: string; description: string; emoji: string };
}) => {
  const response = await API.put(`/workspaces/${workspaceId}/projects/${projectId}`, data);
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const response = await API.get(`/workspaces/${workspaceId}/projects/${projectId}/analytics`);
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const response = await API.get(`/workspaces/${workspaceId}/projects/${projectId}`);
  return response.data;
};
