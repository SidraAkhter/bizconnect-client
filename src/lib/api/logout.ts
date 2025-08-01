import API from "@/lib/api";

const logoutMutationFn = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export default logoutMutationFn;
