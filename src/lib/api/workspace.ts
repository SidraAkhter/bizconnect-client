// src/lib/api/workspace.ts

import API from "./api";

export const getAllWorkspacesUserIsMemberQueryFn = async () => {
  const response = await API.get("/workspaces/user");
  return response.data;
};

export const createWorkspaceMutationFn = async (data: {
  name: string;
  description: string;
}) => {
  const response = await API.post("/workspaces", data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { name: string; description: string };
}) => {
  const response = await API.put(`/workspaces/${workspaceId}`, data);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { roleId: string; memberId: string };
}) => {
  const response = await API.put(`/workspaces/${workspaceId}/members/role`, data);
  return response.data;
};

export const deleteWorkspaceMutationFn = async (workspaceId: string) => {
  const response = await API.delete(`/workspaces/${workspaceId}`);
  return response.data;
};

// ✅ This was missing — now added
export const getWorkspaceByIdQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/workspaces/${workspaceId}`);
  return response.data;
};
