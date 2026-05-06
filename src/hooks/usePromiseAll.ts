import { ref } from 'vue'

interface Options<T> {
  manual?: boolean
  loading?: (load: boolean) => void
  onError?: (err: any) => void
  onSuccess?: (data: T) => void
}

export function usePromiseAll<T extends Record<string, any>>(
  apiMap: Record<string, (...args: any[]) => Promise<any>>,
  options?: Options<T>
) {
  const data = ref<Partial<T>>({})
  const error = ref<any>(null)

  const run = async () => {
    const entries = Object.entries(apiMap)

    if (!entries.length) return {} as T

    options?.loading?.(true)

    try {
      const res = await Promise.all(entries.map(([, fn]) => fn()))

      const result: Partial<T> = {}

      entries.forEach(([key], index) => {
        result[key as keyof T] = res[index]
      })

      data.value = result
      options?.onSuccess?.(result as T)
      debugger

      return result as T
    } catch (err) {
      error.value = err
      options?.onError?.(err)
      throw err
    } finally {
      options?.loading?.(false)
    }
  }

  if (!options?.manual) {
    run()
  }

  return {
    data,
    error,
    run
  }
}
