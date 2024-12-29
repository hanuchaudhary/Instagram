import { create } from 'zustand'
import api from '@/config/axios'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'banned'
  isVerified: boolean
}

interface Post {
  id: string
  userId: string
  content: string
  type: 'image' | 'video' | 'text'
  status: 'active' | 'deleted'
}

interface Report {
  id: string
  reporterId: string
  targetId: string
  targetType: 'post' | 'comment' | 'user'
  reason: string
  status: 'pending' | 'resolved'
}

interface AdminStore {
  users: User[]
  posts: Post[]
  reports: Report[]
  fetchUsers: () => Promise<void>
  fetchPosts: () => Promise<void>
  fetchReports: () => Promise<void>
  updateUserRole: (userId: string, role: 'admin' | 'user') => Promise<void>
  updateUserStatus: (userId: string, status: 'active' | 'banned') => Promise<void>
  updateUserVerification: (userId: string, isVerified: boolean) => Promise<void>
  deletePost: (postId: string) => Promise<void>
  resolveReport: (reportId: string) => Promise<void>
}

const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  posts: [],
  reports: [],
  
  fetchUsers: async () => {
    const response = await api.get(`/admin/users`)
    set({ users: response.data })
  },

  fetchPosts: async () => {
    const response = await api.get(`/admin/posts`)
    set({ posts: response.data })
  },

  fetchReports: async () => {
    const response = await api.get(`/admin/reports`)
    set({ reports: response.data })
  },

  updateUserRole: async (userId, role) => {
    await api.put(`/admin/users/${userId}/role`, { role })
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, role } : user
      ),
    }))
  },

  updateUserStatus: async (userId, status) => {
    await api.put(`/admin/users/${userId}/status`, { status })
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, status } : user
      ),
    }))
  },

  updateUserVerification: async (userId, isVerified) => {
    await api.put(`/admin/users/${userId}/verify`, { isVerified })
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isVerified } : user
      ),
    }))
  },

  deletePost: async (postId) => {
    await api.delete(`/admin/posts/${postId}`)
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }))
  },

  resolveReport: async (reportId) => {
    await api.put(`/admin/reports/${reportId}/resolve`)
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === reportId ? { ...report, status: 'resolved' } : report
      ),
    }))
  },

}))

export default useAdminStore
