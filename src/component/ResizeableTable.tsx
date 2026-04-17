import { defineComponent, computed, ref } from 'vue'
import { Table } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'

interface Props extends TableProps {
  columns: any[]
  dataSource: any[]
  showSelection?: boolean
  rowKey?: string | ((record: any) => Key)
}
// TODO : 优化 defineExpose 暴露清空选中项 或者其他方法v_model
export default defineComponent({
  name: 'ResizeableTable',
  props: {
    ...Table.props,
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
    }
  },
  emits: ['selectionChange'],
  setup(props: Props, { slots, emit, expose }) {
    // 选择功能
    const selectedRowKeys = ref<Key[]>([])
    const rowSelection = computed(() => {
      if (!props.showSelection) return undefined

      return {
        selectedRowKeys: selectedRowKeys.value,
        onChange: (keys: Key[], rows: any[]) => {
          selectedRowKeys.value = keys
          // 只负责通知外部
          emit('selectionChange', {
            keys,
            rows
          })
        }
      }
    })

    // 清空选中
    const clearSelection = () => {
      selectedRowKeys.value = []
      emit('selectionChange', {
        keys: [],
        rows: []
      })
    }

    const handleResizeColumn = (w: number, col: any) => {
      col.width = w
    }

    // 透传 props
    const tableProps = computed(() => {
      const { columns, dataSource, showSelection, rowKey, ...rest } = props
      return {
        ...rest,
        rowSelection: rowSelection.value
      }
    })

    expose({
      clearSelection
    })

    // render
    return () => {
      return (
        <Table
          rowKey={props.rowKey}
          {...tableProps.value}
          columns={props.columns}
          dataSource={props.dataSource}
          onResizeColumn={handleResizeColumn}
          v-slots={slots}
        />
      )
    }
  }
})
