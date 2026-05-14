import { useFormDrawer } from '@/hooks/useFormDrawer'
import { CreateUser } from '@/services'
import { useMessage } from '@/hooks/useMessage'

const { success } = useMessage()
// 单列模式
const singleInstance = useFormDrawer()

export function useUserForm() {
  const { isEdit, formData: oldFormData } = singleInstance

  const submit = async (formData?: any) => {
    if (isEdit.value) {
      console.log('update', oldFormData, formData)
      // TODO 更新用户 对比数据 拿到更新项在进行更新
    } else {
      const res: any = await CreateUser({
        username: formData?.username,
        password: formData?.password,
        email: formData?.email
      })
      if (res.code == 200) {
        success('添加成功')
        singleInstance.close()
        singleInstance.refresh()
      } else {
        success(res.message || '添加失败')
      }
    }
  }
  return Object.assign({}, singleInstance, { submit })
}
