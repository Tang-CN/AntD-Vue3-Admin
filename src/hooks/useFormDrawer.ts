import { computed, ref } from 'vue'

export function useFormDrawer<T = any>() {
  const visible = ref(false)
  const loading = ref(false)
  const formData = ref<T | null>(null)

  const open = (record?: T) => {
    visible.value = true
    formData.value = record ? { ...record } : null
  }

  const close = () => {
    visible.value = false
    formData.value = null
  }

  const refreshCallback = ref<() => void>()
  const refresh = () => {
    refreshCallback.value?.()
  }

  const onRefresh = (fn: () => void) => {
    refreshCallback.value = fn
  }

  const setLoading = (val: boolean) => {
    loading.value = val
  }

  const reset = () => {
    formData.value = null
  }

  const isEdit = computed(() => !!formData.value)

  return {
    visible,
    isEdit,
    loading,
    formData,
    open,
    close,
    reset,
    setLoading,
    refresh,
    onRefresh
  }
}
