import { defineComponent, computed, useAttrs, type PropType, unref, type Ref } from 'vue'
import { Button, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'

interface ActionContext {
  selectedCount: number
  selectedKeys: any[]
  selectedRows: any[]
  record: any
}

export interface ActionButtonItem {
  key: string
  label: string | ((ctx: ActionContext) => string)
  type?: ButtonProps['type']
  danger?: boolean
  disabled?: boolean | ((ctx: ActionContext) => boolean)
  visible?: boolean | ((ctx: ActionContext) => boolean)
  onClick: (ctx: ActionContext) => void
  [key: string]: any
}
interface Props extends ButtonProps {
  buttons: ActionButtonItem[]
  selectedKeys?: any[]
  selectedRows?: any[]
  record?: any
}

function useActionButtons(
  buttons: Ref<ActionButtonItem[]> | ActionButtonItem[],
  ctx: Ref<ActionContext>
) {
  return computed(() => {
    const list = unref(buttons) // 兼容 ref / 普通数组
    const value = ctx.value
    return list
      .filter(btn => {
        if (typeof btn.visible === 'function') {
          return btn.visible(value)
        }
        return btn.visible !== false
      })
      .map(btn => ({
        ...btn,
        label: typeof btn.label === 'function' ? btn.label(value) : btn.label,
        disabled: typeof btn.disabled === 'function' ? btn.disabled(value) : btn.disabled
      }))
  })
}

export default defineComponent({
  name: 'ActionButtonGroup',
  inheritAttrs: false,
  props: {
    buttons: {
      type: Array as PropType<ActionButtonItem[]>,
      required: true
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: Array,
      default: () => []
    },
    selectedCount: {
      type: Number,
      default: 0
    },
    record: {
      type: Object,
      default: null
    }
  },
  setup(props: Props) {
    const attrs = useAttrs()
    const ctx = computed<ActionContext>(() => {
      return {
        selectedKeys: props.selectedKeys,
        selectedCount: props.selectedKeys?.length || 0,
        selectedRows: props.selectedRows,
        record: props.record
      }
    })

    const list = useActionButtons(props.buttons, ctx)

    //render 按钮配置覆盖 attrs
    return () => (
      <Space>
        {list.value.map(({ key, label, disabled, onClick, ...rest }) => (
          <Button
            {...attrs}
            {...rest}
            key={key}
            disabled={disabled}
            onClick={() => onClick(ctx.value)}
          >
            {label}
          </Button>
        ))}
      </Space>
    )
  }
})
