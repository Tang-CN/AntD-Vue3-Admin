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
  return httpGet<any>('/users', null, data)
}
