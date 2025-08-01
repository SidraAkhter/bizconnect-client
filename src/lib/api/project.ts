import API from "./api";

export const createProjectMutationFn = async ({
  workspaceId,
  name,
  description,
  emoji,
}: {
  workspaceId: string;
  name: string;
  description: string;
  emoji?: string;
}) => {
  const res = await API.post(`/projects`, {
    workspaceId,
    name,
    description,
    emoji,
  });
  return res.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: {
  projectId: string;
  workspaceId: string;
  data: {
    name: string;
    description: string;
    emoji?: string;
  };
}) => {
  const res = await API.put(`/projects/${projectId}`, {
    workspaceId,
    ...data,
  });
  return res.data;
};

export const getProjectByIdQueryFn = async (projectId: string) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data;
};

export const getProjectAnalyticsQueryFn = async (projectId: string) => {
  const res = await API.get(`/projects/${projectId}/analytics`);
  return res.data;
};

export const deleteProjectMutationFn = async ({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) => {
  const res = await API.delete(`/projects/${projectId}`, {
    data: { workspaceId },
  });
  return res.data;
};
