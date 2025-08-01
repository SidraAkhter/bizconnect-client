import API from "./api";

const logoutMutationFn = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export default logoutMutationFn;
