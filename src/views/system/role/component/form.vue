<template>
  <FormDrawer
    v-model:visible="formDrawer.visible.value"
    :title="title"
    :fields="formFields"
    :form-values="formDrawer.formData.value"
    @submit="handleSubmit"
    ok-text="保存"
    cancel-text="关闭"
    :confirm-loading="formDrawer.loading.value"
  >
    <template #com>
      <FormItem label="自定义字段">
        <div class="flex items-center gap-2">
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" size="small" />
          <span class="text-red-500">这是完全自定义的内容，可以放任何组件</span>
          <Button type="link" size="small">点击选择</Button>
        </div>
      </FormItem>
    </template>
  </FormDrawer>
</template>

<script setup lang="ts">
import FormDrawer from '@/component/FormDrawer.tsx'
// import type { FormFieldConfig } from '@/component/FormDrawer.tsx'
import { useRoleForm } from '../useRoleForm'
import { computed, ref } from 'vue'
const formDrawer = useRoleForm()
const title = computed(() => (formDrawer.isEdit.value ? '编辑角色' : '添加角色'))

// 表单字段配置数组 TODO：options 动态好像有问题
const formFields = ref<any>([
  {
    name: 'name',
    label: '用户名',
    type: 'input',
    required: true,
    rules: [{ required: true, message: '请输入用户名' }],
    placeholder: '请输入用户名'
  },
  {
    name: 'code',
    label: '编码',
    type: 'input',
    required: true,
    rules: [{ required: true, message: '请输入编码' }],
    placeholder: '请输入编码'
  },
  {
    name: 'description',
    label: '描述',
    type: 'textarea',
    required: true,
    props: {
      rows: 4,
      maxLength: 500,
      showCount: true
    }
  }
])

const handleSubmit = async v => {
  await formDrawer.submit(v)
}
</script>
