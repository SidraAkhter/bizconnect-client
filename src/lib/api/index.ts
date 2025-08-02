// src/lib/api/index.ts

export { default } from "./api"; // default API instance
export { default as logoutMutationFn } from "./logout";

// Project APIs
export {
  createProjectMutationFn,
  deleteProjectMutationFn,
  editProjectMutationFn,
  getProjectAnalyticsQueryFn,
  getProjectByIdQueryFn,
} from "./project";

// Workspace APIs
export {
  getAllWorkspacesUserIsMemberQueryFn,
  createWorkspaceMutationFn,
  editWorkspaceMutationFn,
  deleteWorkspaceMutationFn,
  changeWorkspaceMemberRoleMutationFn,
  getWorkspaceByIdQueryFn, // ✅ add this if not already
} from "./workspace";

// Task APIs
export {
  createTaskMutationFn,
  editTaskMutationFn,
  deleteTaskMutationFn,
  getTasksQueryFn,
  getTaskByIdQueryFn,
} from "./task";

// ✅ If you have this in a separate file later
// export { getWorkspaceAnalyticsQueryFn } from "./analytics";
// export { getCurrentUserQueryFn } from "./user";
