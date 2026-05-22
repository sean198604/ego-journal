import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 请求拦截：自动带 token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：401 自动登出
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// 期刊 API
export const journalApi = {
  list: (params) => api.get('/journals', { params }),
  get: (id) => api.get(`/journals/${id}`),
  create: (data) => api.post('/journals', data),
  update: (id, data) => api.put(`/journals/${id}`, data),
  delete: (id) => api.delete(`/journals/${id}`),
  publish: (id) => api.patch(`/journals/${id}/publish`),
  view: (id) => api.patch(`/journals/${id}/view`),
}

// 文章 API
export const articleApi = {
  list: (journalId, params) => api.get(`/journals/${journalId}/articles`, { params }),
  get: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  like: (id) => api.post(`/articles/${id}/like`),
}

// 栏目 API
export const categoryApi = {
  list: () => api.get('/categories'),
}

// 认证 API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// 站点配置 API
export const configApi = {
  list: () => api.get('/config'),
  getGroup: (group) => api.get(`/config/group/${group}`),
  getPublic: () => api.get('/config/public'),
  get: (key) => api.get(`/config/${key}`),
  update: (key, value) => api.put(`/config/${key}`, { value }),
  batchUpdate: (items) => api.post('/config/batch', items),
}

// 图片上传
export const uploadApi = {
  image: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export default api
