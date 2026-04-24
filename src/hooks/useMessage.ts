import { message } from 'ant-design-vue'

let currentKey = ''

export function useMessage() {
  const show = (type: 'success' | 'error', content: string) => {
    const key = `${type}_${content}`

    // 如果同一个提示正在展示，直接拦截
    if (currentKey === key) return

    currentKey = key

    message.destroy() // 🔥 关键：保证只存在一个

    message[type]({
      content,
      key,
      duration: 2,
      onClose: () => {
        currentKey = ''
      }
    })
  }

  const success = (content: string) => {
    show('success', content)
  }

  const error = (content: string) => {
    show('error', content)
  }

  return {
    success,
    error
  }
}
