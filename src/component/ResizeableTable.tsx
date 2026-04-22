import { defineComponent, computed, ref, useAttrs } from 'vue'
import { Table, Pagination } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'

interface Props extends TableProps {
  columns: any[]
  dataSource: any[]
  showSelection?: boolean
  rowKey?: string | ((record: any) => Key)
  pagination?: {
    pageSize?: number
    total?: number
    current?: number
    onChange?: (current: number, pageSize: number) => void
  }
}
// TODO : 优化 defineExpose 暴露清空选中项 或者其他方法v_model
export default defineComponent({
  name: 'ResizeableTable',
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      required: true
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    pagination: {
      type: Object,
      default: () => ({ pageSize: 10, total: 0, current: 1 })
    }
  },
  emits: ['selectionChange', 'pageChange'],
  setup(props: Props, { slots, emit, expose }) {
    // 透传props
    const attrs = useAttrs()

    // 选择功能
    const selectedRowKeys = ref<Key[]>([])
    const rowSelection = computed(() => {
      if (!props.showSelection) return undefined
      return {
        selectedRowKeys: selectedRowKeys.value,
        onChange: selectChange
      }
    })

    const selectChange = (keys: Key[], rows: any[]) => {
      selectedRowKeys.value = keys
      // 只负责通知外部
      emit('selectionChange', {
        keys,
        rows
      })
    }

    // 清空选中
    const clearSelection = () => {
      selectedRowKeys.value = []
      emit('selectionChange', {
        keys: [],
        rows: []
      })
    }

    // 拖拽调整列宽
    const handleResizeColumn = (w: number, col: any) => {
      col.width = w
    }

    // 分页
    const handlePageChange = (current: number, pageSize: number) => {
      props.pagination?.onChange?.(current, pageSize)
      emit('pageChange', { current, pageSize })
    }

    // 暴露方法
    expose({
      clearSelection
    })

    // render
    return () => {
      return (
        <div class="flex flex-col h-full">
          <Table
            {...attrs}
            rowKey={props.rowKey}
            columns={props.columns}
            dataSource={props.dataSource}
            pagination={false}
            rowSelection={rowSelection.value}
            onResizeColumn={handleResizeColumn}
            v-slots={{ ...slots }}
          />
          {props.pagination && (
            <div class="mt-auto flex justify-end py-4">
              <Pagination
                {...props.pagination}
                onChange={handlePageChange}
                v-slots={{
                  buildOptionText: ({ value }) => `${value} 条/页`
                }}
              />
            </div>
          )}
        </div>
      )
    }
  }
})
