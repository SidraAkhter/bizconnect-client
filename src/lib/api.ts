import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => {
  try {
    // Set a shorter timeout for logout specifically
    const response = await API.post("/auth/logout", {}, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.warn("Error during logout API call:", error);
    // Handle the error manually by clearing the cookie on the client side
    document.cookie = "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Return a fake successful response so the UI can continue
    return { message: "Logged out on client side (server unreachable)" };
  }
};

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    console.log("Fetching current user from API");
    try {
      const response = await API.get(`/user/current`);
      console.log("Current user API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Current user API error:", error);
      throw error;
    }
  };

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  if (!workspaceId || workspaceId === 'undefined') {
    throw new Error("Invalid workspace ID: Cannot fetch workspace with undefined ID");
  }
  
  console.log(`Fetching workspace details for ID: ${workspaceId}`);
  try {
    const response = await API.get(`/workspace/${workspaceId}`);
    console.log("Workspace details API response:", response.data);
    
    // Check if workspace has members array
    if (response.data.workspace) {
      console.log("Workspace members count from workspace object:", 
        response.data.workspace.members ? response.data.workspace.members.length : "No members array");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace details:", error);
    throw error;
  }
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  console.log(`Fetching members for workspace: ${workspaceId}`);
  try {
    const response = await API.get(`/workspace/members/${workspaceId}`);
    console.log("Workspace members API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    throw error;
  }
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  if (!workspaceId || workspaceId === 'undefined') {
    throw new Error("Invalid workspace ID: Cannot fetch analytics with undefined ID");
  }
  
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  try {
    console.log("Joining workspace with invite code:", inviteCode);
    
    // Validate the invite code
    if (!inviteCode) {
      throw new Error("Invite code is required");
    }
    
    // Make the API call
    const response = await API.post(`/member/workspace/${inviteCode}/join`);
    console.log("Join workspace API response:", response.data);
    
    // If successful, let's fetch the updated members list immediately
    // to make sure it's in the cache
    if (response.data && response.data.workspaceId) {
      console.log("Fetching updated members list for workspace:", response.data.workspaceId);
      try {
        const membersResponse = await API.get(`/workspace/members/${response.data.workspaceId}`);
        console.log("Updated members list:", membersResponse.data);
      } catch (err) {
        console.error("Error fetching updated members list:", err);
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Error joining workspace:", error);
    
    // Rethrow with more useful error message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  if (!workspaceId || workspaceId === 'undefined') {
    throw new Error("Invalid workspace ID: Cannot fetch projects for undefined workspace");
  }
  
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};


export const editTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{message: string;}> => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update/`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};
