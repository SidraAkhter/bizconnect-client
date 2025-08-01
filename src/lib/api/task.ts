import API from "./api";

// Create Task
export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  data: {
    name: string;
    description: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  };
}) => {
  const response = await API.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    data
  );
  return response.data;
};

// Edit Task
export const editTaskMutationFn = async ({
  workspaceId,
  projectId,
  taskId,
  data,
}: {
  workspaceId: string;
  projectId: string;
  taskId: string;
  data: {
    name?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  };
}) => {
  const response = await API.put(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

// Delete Task
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

// Get All Tasks
export const getTasksQueryFn = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const response = await API.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`
  );
  return response.data;
};

// Get Task by ID
export const getTaskByIdQueryFn = async ({
  workspaceId,
  projectId,
  taskId,
}: {
  workspaceId: string;
  projectId: string;
  taskId: string;
}) => {
  const response = await API.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
  return response.data;
};
