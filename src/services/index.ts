import { httpGet, httpPost } from '@/utils/http'

//
export const Login = ({ username, password }: { username: string; password: string }) => {
  return httpPost<any>('/auth/login', {
    username,
    password
  })
}

export const Logout = (userId: string) => {
  return httpGet<any>('/auth/logout', { userId })
}

export const GetUserInfo = (userId: string) => {
  return httpGet<any>('/auth/profile', { userId })
}

export const GetUserList = (data: any) => {
  return httpGet<any>('/users', {}, data)
}

export const CreateUser = (data: any) => {
  return httpPost<any>('/users', data)
}

export const DeleteUser = (userIds: number[]) => {
  return httpPost<any>('/users/delete', { userIds })
}

export const GetUserDetail = (id: number) => {
  return httpGet<any>('/users', { id })
}

export const GetRoles = () => {
  return httpGet<any>('/roles')
}

export const GetRoleDetail = (id: number) => {
  return httpGet<any>('/roles', { id })
}

export const DeleteRoles = (roleIds: number[]) => {
  return httpPost<any>('/roles/delete', { roleIds })
}

export const CreateRole = (data: any) => {
  return httpPost<any>('/roles', data)
}
