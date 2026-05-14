<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppRouter } from '@/hooks/useAppRouter'
import { useMessage } from '@/hooks/useMessage'
import { useUserForm } from './useRoleForm'
import { usePromiseAll } from '@/hooks/usePromiseAll'
import { DeleteUser, GetRoles, GetUserDetail, GetUserList } from '@/services'
import ResizeableTable from '@/component/ResizeableTable'
import ActionButtons from '@/component/ActionButtonGroup'
// import Form from './component/form.vue'
import type { ActionButtonItem } from '@/component/ActionButtonGroup'
const { success } = useMessage()
const route = useRoute()
const router = useAppRouter()
const userForm = useUserForm()
const tableRef = ref(null)
const tableData = ref([])
const columns = ref([
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    minWidth: 100,
    ellipsis: true,
    resizable: true
  },
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
    ellipsis: true,
    resizable: true,
    width: 150,
    minWidth: 100,
    maxWidth: 300
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },

  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
])

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true
})

const selectedKeys = ref([])
const selectedRows = ref([])
const actionButtons = ref<ActionButtonItem[]>([
  {
    key: 'add',
    label: '新增',
    type: 'primary',
    shape: 'circle',
    onClick: ctx => {
      // ctx.selectedCount
      userForm.open()
      console.log('新增')
    }
  },
  {
    key: 'clear',
    label: '清空选中',
    type: 'primary',
    disabled: ctx => ctx.selectedCount === 0,
    onClick: ctx => {
      clear()
    }
  },
  {
    key: 'delete',
    type: 'primary',
    label: ctx => `删除(${ctx.selectedCount})`,
    danger: true,
    disabled: ctx => ctx.selectedCount === 0,
    onClick: async ctx => {
      handleDelete(ctx.selectedKeys)
    }
  }
])

const tableButtons = ref<ActionButtonItem[]>([
  {
    key: 'edit',
    label: '编辑',
    // type: 'primary',
    // shape: 'circle',
    onClick: ctx => {
      console.log(ctx)
    }
  },
  {
    key: 'delete',
    label: '删除',
    danger: true,
    // type: 'primary',
    // shape: 'circle',
    onClick: ctx => {
      console.log(ctx)
      const ids = [ctx.record.id]
      handleDelete(ids)
    }
  }
])

const handleGetUserDetail = async (id: number) => {
  const res = await GetUserDetail(id)
  return res.data
}

const handleDelete = async (ids: number[]) => {
  const res: any = await DeleteUser(ids)
  if (res.code == 200) {
    success('删除成功')
    handleGetRoleList()
  }
}

const handleTableChange = async ({ current, pageSize }) => {
  pagination.value.current = current
  pagination.value.pageSize = pageSize
  await handleGetRoleList()
}
const handleGetRoleList = async () => {
  const res = await GetRoles({
    page: pagination.value.current,
    pageSize: pagination.value.pageSize
  })
  tableData.value = res.data.list
  pagination.value.total = res.data.total
}

const clear = () => {
  tableRef.value?.clearSelection()
}

const onSelect = ({ keys, rows }) => {
  console.log(keys, rows)
  selectedKeys.value = keys
  selectedRows.value = rows
}

userForm.onRefresh(() => {
  handleGetRoleList()
})

onMounted(() => {
  handleGetRoleList()
})
</script>

<template>
  <div class="p-6 bg-white rounded-md h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ route.meta.title }}</h2>
      <ActionButtons
        :shape="'round'"
        :buttons="actionButtons"
        :selectedRows="selectedRows"
        :selectedKeys="selectedKeys"
      />
    </div>
    <div class="flex-1 min-h-0 overflow-auto">
      <ResizeableTable
        ref="tableRef"
        rowKey="id"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :bordered="true"
        @pageChange="handleTableChange"
        @selectionChange="onSelect"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'username'">
            <span>Name</span>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <!-- <span>111</span> -->
            <ActionButtons type="link" mode="row" :buttons="tableButtons" :record="record" />
          </template>
        </template>
      </ResizeableTable>
    </div>
    <!-- <Form /> -->
  </div>
</template>

<style scoped lang="scss"></style>
