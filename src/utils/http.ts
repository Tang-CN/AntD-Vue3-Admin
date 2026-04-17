import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { useUserStore, useSystemStore } from '@/store'
import { message } from 'ant-design-vue'

// 创建新的axios实例

const http = axios.create({
  baseURL: 'http://localhost:3000', //
  timeout: 5000, // 超时时间 单位是ms，
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config: any) => {
    // 从store获取token
    const userStore = useUserStore()
    const systemStore = useSystemStore()

    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 开启全局loading
    systemStore.startLoading()

    return config
  },
  (error: AxiosError) => {
    const systemStore = useSystemStore()
    // 清除loading
    systemStore.closeLoading()

    message.error(error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const systemStore = useSystemStore()
    // 请求结束 关闭loading
    systemStore.closeLoading()

    const { status, data } = response
    if (status === 200 && data.code === 200) {
      return data
    } else if (data.code === 401) {
      debugger
    }
    return Promise.reject(response)
  },
  (error: AxiosError) => {
    const systemStore = useSystemStore()
    // 请求错误 关闭loading
    systemStore.closeLoading()

    if (error.message.includes('Network Error')) {
      message.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

const httpGet = <T>(url: string, params?: Record<string, any>, query?: Record<string, any>) => {
  if (params) {
    Object.entries(params).forEach(([_, value]) => {
      url = `${url}/${value}`
    })
  }
  return http.get<T>(url, {
    params: query
  })
}

/**
 * POST 请求封装
 */
const httpPost = <T>(url: string, data?: Record<string, any>, query?: Record<string, any>) => {
  return http.post<T>(url, data, {
    params: query
  })
}

/**
 * 图片上传封装
 * @param url 上传接口地址
 * @param file 要上传的 File 或 File[] 对象
 * @param extraData 其他附加的表单字段
 * @param fieldName 表单字段名，默认是 'file'
 */
const httpUpload = async <T>(
  url: string,
  file: File | File[],
  extraData?: Record<string, any>,
  fieldName = 'file'
) => {
  const formData = new FormData()

  // 添加文件字段
  if (Array.isArray(file)) {
    file.forEach(f => formData.append(fieldName, f))
  } else {
    formData.append(fieldName, file)
  }

  // 添加额外字段
  if (extraData) {
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  const res = await http.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  //TODO: 处理响应 拼接图片地址

  return res
}

export { http, httpGet, httpPost, httpUpload }
