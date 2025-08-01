import API from "@/lib/api";

const getAllWorkspacesUserIsMemberQueryFn = async () => {
  const response = await API.get("/workspaces/user");
  return response.data;
};

export default getAllWorkspacesUserIsMemberQueryFn;
