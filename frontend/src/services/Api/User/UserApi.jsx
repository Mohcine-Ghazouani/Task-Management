import {axiosClient} from "../../../api/axios";

const UserApi = {
  getCsrfToken: async () => {
    return await axiosClient.get("/sanctum/csrf-cookie", {
      baseURL: import.meta.env.VITE_BACKEND_URL,
    });
  },
  login: async (email, password) => {
    return await axiosClient.post("/login", { email, password });
  },
  getUser: async () => {
    return await axiosClient.get("/user");
  },
};

export default UserApi;
