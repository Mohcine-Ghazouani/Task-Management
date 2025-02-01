import { axiosClient } from "../../../api/axios";

const UserApi = {
  getCsrfToken: async () => {
    return axiosClient.get("/sanctum/csrf-cookie", {
      baseURL: import.meta.env.VITE_BACKEND_URL,
    });
  },
  login: async (email, password) => {
    return axiosClient.post("/login", { email, password });
  },
  logout: async () => {
    return axiosClient.post("/logout");
  },
  changePassword: (passwordData) => {
    return axiosClient.post("/user/password", passwordData);
  },
  getUser: async () => {
    return axiosClient.get("/user");
  },
  getUsers: async () => {
    return axiosClient.get("/users");
  },
  createUser: async (userData) => {
    return await axiosClient.post("/users", userData);
  },
  deleteUser: async (id) => {
    return await axiosClient.delete(`/users/${id}`);
  },
  updateUser: async (id, userData) => {
    return await axiosClient.put(`/users/${id}`, userData);
  },
  getTeams: async () => {
    return axiosClient.get("/teams");
  },
  createTeam: async (teamData) => {
    return await axiosClient.post("/teams", teamData);
  },
  updateTeam: async (id, name) => {
    return await axiosClient.put(`/teams/${id}`, name);
  },

  getTasks: async () => {
    return axiosClient.get("/tasks");
  },
  getTask: async (id) => {
    return axiosClient.get(`/tasks/${id}`);
  },
  getUserTasks: async (userId) => {
    return axiosClient.get(`/tasks/user/${userId}`);
  },
  createTask: async (taskData) => {
    return await axiosClient.post("/tasks", taskData);
  },

  updateTask: async (id, taskData) => {
    return axiosClient.put(`/tasks/${id}`, taskData);
  },
  deleteTask: async (id) => {
    return await axiosClient.delete(`/tasks/${id}`);
  },
  getNotifications: async () => {
    return axiosClient.get("/notifications");
  },
  getUserNotifications: async () => {
    return axiosClient.get(`/notification`);
  },
  updateNotification: async (id) => {
    return axiosClient.put(`/notifications/${id}`, { is_read: true });
  },

  getComments: async () => {
    return axiosClient.get(`/comments`);
  },
  createComment: async (commentData) => {
    return await axiosClient.post("/comments", commentData);
  },
  getUserComments: async (userId) => {
    return axiosClient.get(`/comments/user/${userId}`);
  },
};

export default UserApi;
