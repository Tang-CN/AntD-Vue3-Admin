<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GetUserList } from '@/services'
import ResizeableTable from '@/component/ResizeableTable'
const tableRef = ref(null)
const tableData = ref([])
const columns = ref([
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    resizable: true
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
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
const handleTableChange = async ({ current, pageSize }) => {
  debugger
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
  console.log('selectedRowKeys: ', keys)
  console.log('selectedRows: ', rows)
}
onMounted(() => {
  handleGetUserList()
})
</script>

<template>
  <div class="p-6 bg-white rounded-md h-full">
    <h2 class="text-xl font-bold mb-4">用户管理</h2>

    <ResizeableTable
      ref="tableRef"
      rowKey="id"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
      @selectionChange="onSelect"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'username'">
          <span>Name</span>
        </template>
      </template>
    </ResizeableTable>
  </div>
</template>

<style scoped lang="scss"></style>
