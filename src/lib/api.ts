import axios from "axios";

// Axios instance
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ========= Authentication =========
export const getCurrentUserQueryFn = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

// ========= Workspace =========
export const getWorkspaceByIdQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/workspaces/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/workspaces/${workspaceId}/analytics`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/workspaces/${workspaceId}/members`);
  return response.data;
};

// ========= Projects =========
export const getProjectsInWorkspaceQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/workspaces/${workspaceId}/projects`);
  return response.data;
};

// ========= Tasks =========
export const getTasksQueryFn = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const response = await API.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
  return response.data;
};

export const getAllTasksQueryFn = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

// ✅ Define a shared type for task data
type TaskData = {
  title: string;
  description: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string;
  assignedTo: string;
};

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  data: TaskData;
}) => {
  const response = await API.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    data
  );
  return response.data;
};

export const updateTaskMutationFn = async ({
  workspaceId,
  projectId,
  taskId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  taskId: string;
  data: TaskData;
}) => {
  const response = await API.patch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  projectId,
  taskId,
}: {
  workspaceId: string;
  projectId: string;
  taskId: string;
}) => {
  const response = await API.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
  return response.data;
};

// ========= Invite User =========
export const inviteUserMutationFn = async ({
  workspaceId,
  email,
}: {
  workspaceId: string;
  email: string;
}) => {
  const response = await API.post(`/workspaces/${workspaceId}/invite`, { email });
  return response.data;
};
