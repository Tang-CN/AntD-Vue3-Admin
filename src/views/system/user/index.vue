<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAppRouter } from '@/hooks/useAppRouter'
import { GetUserList } from '@/services'
import ResizeableTable from '@/component/ResizeableTable'
import ActionButtons from '@/component/ActionButtonGroup'
import { SearchOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const router = useAppRouter()
const tableRef = ref(null)
const tableData = ref([])
const columns = ref([
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    minWidth: 100,
    ellipsis: true,
    resizable: true
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    ellipsis: true,
    resizable: true,
    width: 150,
    minWidth: 100,
    maxWidth: 300
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  }
])

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true
})

const selectedRowKeys = ref([])
const selectedRows = ref([])
const actionButtons = ref<any>([
  {
    key: 'add',
    label: '新增',
    type: 'primary',
    shape: 'circle',
    onClick: () => {
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
    onClick: ctx => {
      console.log('删除', ctx.selectedRows)
    }
  }
])

const handleTableChange = async ({ current, pageSize }) => {
  pagination.value.current = current
  pagination.value.pageSize = pageSize
  await handleGetUserList()
}
const handleGetUserList = async () => {
  const res = await GetUserList({
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
  selectedRowKeys.value = keys
  selectedRows.value = rows
}
onMounted(() => {
  handleGetUserList()
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
        :selectedCount="selectedRowKeys.length"
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
      </ResizeableTable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
