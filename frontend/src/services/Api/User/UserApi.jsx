import {axiosClient} from "../../../api/axios";

const UserApi = {
  getCsrfToken: async () => {
    return await axiosClient.get('/sanctum/csrf-cookie', {
      baseURL: import.meta.env.VITE_BACKEND_URL,
    });
  },
  login: async (email, password) => {
    return await axiosClient.post('/login', {email,password})
  },
  logout: async () => {
    return await axiosClient.post('/logout')
  },
  getUser: async () => {
    return await axiosClient.get('/user')
  },
  getUsers: async () => {
    return await axiosClient.get('/users')
  },  
  deleteUser: async (id) => {
    return await axiosClient.delete(`/users/${id}`)
  },
  updateUser: async (id, userData) => {
    return await axiosClient.put(`/users/${id}`, userData)
  },

  getTasks: async () => {
    return await axiosClient.get('/tasks')
  },
  getTask: async (id) => {
    return await axiosClient.get(`/tasks/${id}`)
  },
  createTask: async (taskData) => {
    return await axiosClient.post('/tasks', taskData)
  },  

  updateTask: async (id, taskData) => {
    return await axiosClient.put(`/tasks/${id}`, taskData)
  },
  deleteTask: async (id) => {
    return await axiosClient.delete(`/tasks/${id}`)
  },
  getNotifications: async () => {
    return await axiosClient.get('/notifications')
  },
  updateNotification: async (id ) => {
    return await axiosClient.put(`/notifications/${id}`, {is_read: true})
  },

};

export default UserApi
