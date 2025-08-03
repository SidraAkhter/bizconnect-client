import axios from "axios";

// Axios instance
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ========= Shared Types =========
type TaskData = {
  title: string;
  description: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string;
  assignedTo: string;
};

type ProjectData = {
  name: string;
  description: string;
  emoji: string;
};

type WorkspaceData = {
  name: string;
  description: string;
};

// ========= Authentication =========
export const getCurrentUserQueryFn = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const loginMutationFn = async (data: { email: string; password: string }) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const logoutMutationFn = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

// ========= Workspaces =========
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

export const getAllWorkspacesUserIsMemberQueryFn = async () => {
  const response = await API.get("/workspaces");
  return response.data;
};

export const createWorkspaceMutationFn = async (data: WorkspaceData) => {
  const response = await API.post("/workspaces", data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: WorkspaceData;
}) => {
  const response = await API.patch(`/workspaces/${workspaceId}`, data);
  return response.data;
};

export const deleteWorkspaceMutationFn = async (workspaceId: string) => {
  const response = await API.delete(`/workspaces/${workspaceId}`);
  return response.data;
};

// ========= Projects =========
export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize,
  pageNumber,
}: {
  workspaceId: string;
  pageSize?: number;
  pageNumber?: number;
}) => {
  const response = await API.get(`/workspaces/${workspaceId}/projects`, {
    params: {
      pageSize,
      pageNumber,
    },
  });
  return response.data;
};


export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: ProjectData;
}) => {
  const response = await API.post(`/workspaces/${workspaceId}/projects`, data);
  return response.data;
};

export const editProjectMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  data: ProjectData;
}) => {
  const response = await API.patch(`/workspaces/${workspaceId}/projects/${projectId}`, data);
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

// ========= Tasks =========
export const getTasksQueryFn = async ({
  workspaceId,
  projectId,
  keyword,
  priority,
  status,
  assignedTo,
  pageNumber,
  pageSize,
}: {
  workspaceId: string;
  projectId?: string | null;
  keyword?: string | null;
  priority?: string | null;
  status?: string | null;
  assignedTo?: string | null;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await API.get("/tasks", {
    params: {
      workspaceId,
      projectId,
      keyword,
      priority,
      status,
      assignedTo,
      pageNumber,
      pageSize,
    },
  });
  return response.data;
};


// ✅ Corrected version — only one definition
export const getAllTasksQueryFn = async ({ workspaceId }: { workspaceId: string }) => {
  const response = await API.get(`/workspaces/${workspaceId}/tasks`);
  return response.data;
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

export const editTaskMutationFn = updateTaskMutationFn;

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

// ========= Member Roles =========
export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { memberId: string; roleId: string };
}) => {
  const response = await API.patch(`/workspaces/${workspaceId}/members/role`, data);
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

export const invitedUserJoinWorkspaceMutationFn = async (inviteCode: string) => {
  const response = await API.post(`/workspaces/join/${inviteCode}`);
  return response.data;
};
