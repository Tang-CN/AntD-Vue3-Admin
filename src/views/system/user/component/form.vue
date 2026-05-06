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
import type { FormFieldConfig } from '@/component/FormDrawer.tsx'
import { useUserForm } from '../useUserForm'
import { computed, watch } from 'vue'
const formDrawer = useUserForm()

const title = computed(() => (formDrawer.isEdit.value ? '编辑用户' : '添加用户'))

// 表单字段配置数组 TODO：options 动态好像有问题
const formFields: FormFieldConfig[] = [
  {
    name: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    rules: [{ required: true, message: '请输入用户名' }],
    placeholder: '请输入用户名'
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    // disabled: true,
    required: true,
    rules: [{ required: true, message: '请输入邮箱' }],
    placeholder: '请输入邮箱'
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    required: true,
    rules: [{ required: true, message: '请输入密码' }],
    placeholder: '请输入密码'
  },
  {
    name: 'age',
    label: '年龄',
    type: 'input-number',
    props: {
      min: 1,
      max: 120
    }
  },
  {
    name: 'role',
    label: '角色',
    type: 'select'
    // options: formDrawer.roles.value.map(item => ({
    //   label: item.name,
    //   value: item.id
    // }))
    // required: true
  },
  {
    name: 'birthday',
    label: '生日',
    type: 'date-picker'
  },
  {
    name: 'gender',
    label: '性别',
    type: 'radio',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
      { label: '保密', value: 0 }
    ]
  },
  {
    name: 'status',
    label: '启用状态',
    type: 'switch'
  },
  {
    name: 'remark',
    label: '备注',
    type: 'textarea',
    props: {
      rows: 4,
      maxLength: 500,
      showCount: true
    }
  }
]

const handleSubmit = async v => {
  await formDrawer.submit(v)
}
</script>
