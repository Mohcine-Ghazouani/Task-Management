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
  changePassword: async (password) => {
    return await axiosClient.post('/reset-password', password)
  },
  getUser: async () => {
    return await axiosClient.get('/user')
  },
  getUsers: async () => {
    return await axiosClient.get('/users')
  },  
  createUser: async (userData) => {
    return await axiosClient.post('/users', userData)
  },
  deleteUser: async (id) => {
    return await axiosClient.delete(`/users/${id}`)
  },
  updateUser: async (id, userData) => {
    return await axiosClient.put(`/users/${id}`, userData)
  },
  getTeams: async () => {
    return await axiosClient.get('/teams')
  },
  createTeam: async (teamData) => {
    return await axiosClient.post('/teams', teamData)
  },
  updateTeam: async (id,name) => {
    return await axiosClient.put(`/teams/${id}`, name)
  },

  getTasks: async () => {
    return await axiosClient.get('/tasks')
  },
  getTask: async (id) => {
    return await axiosClient.get(`/tasks/${id}`)
  },
  getUserTasks: async (userId) => {
    return await axiosClient.get(`/tasks/user/${userId}`)
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
  getUserNotifications: async () => {
    return await axiosClient.get(`/notification`)
  },
  updateNotification: async (id ) => {
    return await axiosClient.put(`/notifications/${id}`, {is_read: true})
  },
  
  getComments: async () => {
    return await axiosClient.get(`/comments`)
  },
  createComment: async (commentData) => {
    return await axiosClient.post('/comments', commentData)
  },
  getUserComments: async (userId) => {
    return await axiosClient.get(`/comments/user/${userId}`)
  },

};

export default UserApi
