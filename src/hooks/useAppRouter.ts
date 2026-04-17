
import { useRouter } from 'vue-router'

interface RouterOptions {
  replace?: boolean
}

export function useAppRouter() {
  const router = useRouter()

  const push = (
    path: string,
    query?: Record<string, any>,
    options?: RouterOptions
  ) => {
    // 过滤无效参数
    const cleanQuery = Object.fromEntries(
      Object.entries(query || {}).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ''
      )
    )

    const route = {
      path,
      query: cleanQuery
    }

    if (options?.replace) {
      router.replace(route)
    } else {
      router.push(route)
    }
  }

  return push
}