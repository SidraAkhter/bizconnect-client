// src/lib/api/index.ts

// Axios instance
export { default } from "./api";

// Logout
export { default as logoutMutationFn } from "./logout";

// Project functions
export {
  createProjectMutationFn,
  deleteProjectMutationFn,
  editProjectMutationFn,
  getProjectAnalyticsQueryFn,
  getProjectByIdQueryFn,
} from "./project";

// Workspace functions
export {
  getAllWorkspacesUserIsMemberQueryFn,
  createWorkspaceMutationFn,
  editWorkspaceMutationFn,
  deleteWorkspaceMutationFn,
  changeWorkspaceMemberRoleMutationFn,
} from "./workspace";

// Task functions
export {
  createTaskMutationFn,
  editTaskMutationFn,
  deleteTaskMutationFn,
  getTasksQueryFn,
  getTaskByIdQueryFn,
} from "./task";

