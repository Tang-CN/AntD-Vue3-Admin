import { defineComponent, useAttrs, ref, watch, type PropType, nextTick } from 'vue'
import {
  Drawer,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  Button,
  Space
} from 'ant-design-vue'
import type { DrawerProps, FormProps, FormItemProps } from 'ant-design-vue'

// 表单项配置类型
export interface FormFieldConfig {
  name: string
  label: string
  type:
    | 'input'
    | 'input-number'
    | 'select'
    | 'date-picker'
    | 'switch'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'password'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rules?: any[]
  options?: { label: string; value: any }[]
  colSpan?: number
  hidden?: boolean
  props?: Record<string, any>
}

// 组件Props类型
interface Props extends DrawerProps {
  visible: boolean
  title?: string
  width?: number | string
  okText?: string
  cancelText?: string
  confirmLoading?: boolean
  fields: FormFieldConfig[]
  formValues?: Record<string, any>
  formProps?: FormProps
  showFooter?: boolean
}

export default defineComponent({
  name: 'FormDrawer',
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '编辑'
    },
    width: {
      type: [Number, String],
      default: 400
    },
    okText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array as PropType<FormFieldConfig[]>,
      default: () => []
    },
    formValues: {
      type: Object,
      default: () => ({})
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({})
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {}
    },
    onSubmit: {
      type: Function as PropType<(values: any) => void>,
      default: () => {}
    }
  },
  emits: ['update:visible', 'cancel', 'submit', 'open'],
  setup(props: Props, { slots, emit, expose }) {
    const attrs = useAttrs()
    const formRef = ref<any>(null)

    // 表单实例
    const formState = ref<Record<string, any>>({})

    // 监听visible变化重置表单
    watch(
      () => props.visible,
      val => {
        if (val) {
          formState.value = { ...props.formValues }
          emit('update:visible', true)
          emit('open')
          // 延迟到dom渲染后再设置表单值
          nextTick(() => {
            formRef.value?.setFieldsValue?.(props.formValues)
          })
        } else {
          formRef.value?.resetFields()
          formState.value = {}
        }
      }
    )

    // 关闭抽屉
    const handleClose = () => {
      emit('update:visible', false)
      emit('cancel')
    }

    // 提交表单
    const handleSubmit = async () => {
      try {
        const values = await formRef.value?.validate()
        emit('submit', values)
      } catch (e) {
        // 校验失败
      }
    }

    // 渲染表单项
    const renderField = (field: FormFieldConfig) => {
      debugger
      if (field.hidden) return null

      const {
        name,
        label,
        type,
        placeholder,
        disabled,
        required,
        rules,
        options,
        props: fieldProps = {}
      } = field

      // 基础表单项
      const commonProps = {
        placeholder: placeholder || `请输入${label}`,
        disabled,
        ...fieldProps
      }

      let control: any = null

      switch (type) {
        case 'input':
          control = <Input v-model={[formState.value[name], 'value']} {...commonProps} />
          break
        case 'password':
          control = <Input.Password v-model={[formState.value[name], 'value']} {...commonProps} />
          break
        case 'textarea':
          control = (
            <Input.TextArea v-model={[formState.value[name], 'value']} rows={4} {...commonProps} />
          )
          break
        case 'input-number':
          control = (
            <InputNumber
              v-model={[formState.value[name], 'value']}
              style={{ width: '100%' }}
              {...commonProps}
            />
          )
          break
        case 'select':
          control = (
            <Select
              v-model={[formState.value[name], 'value']}
              options={options}
              allowClear
              {...commonProps}
            />
          )
          break
        case 'date-picker':
          control = (
            <DatePicker
              v-model={[formState.value[name], 'value']}
              style={{ width: '100%' }}
              {...commonProps}
            />
          )
          break
        case 'switch':
          control = <Switch v-model={[formState.value[name], 'checked']} {...commonProps} />
          break
        case 'checkbox':
          control = <Checkbox v-model={[formState.value[name], 'checked']} {...commonProps} />
          break
        case 'radio':
          control = (
            <Radio.Group
              v-model={[formState.value[name], 'value']}
              options={options}
              {...commonProps}
            />
          )
          break
        default:
          control = <Input v-model={[formState.value[name], 'value']} {...commonProps} />
      }

      return (
        <FormItem label={label} name={name} required={required} rules={rules}>
          {control}
        </FormItem>
      )
    }

    // 暴露方法
    expose({
      formRef,
      validate: () => formRef.value?.validate(),
      resetFields: () => formRef.value?.resetFields(),
      setFieldsValue: (values: Record<string, any>) => formRef.value?.setFieldsValue(values),
      getFieldsValue: () => formRef.value?.getFieldsValue()
    })

    // render
    return () => (
      <Drawer
        {...attrs}
        visible={props.visible}
        title={props.title}
        width={props.width}
        onClose={handleClose}
        destroyOnClose
        v-slots={{
          ...slots,
          footer: slots.footer
            ? () => slots.footer?.()
            : props.showFooter
              ? () => (
                  <div class="flex justify-end">
                    <Space>
                      <Button onClick={handleClose}>{props.cancelText}</Button>
                      <Button type="primary" loading={props.confirmLoading} onClick={handleSubmit}>
                        {props.okText}
                      </Button>
                    </Space>
                  </div>
                )
              : null
        }}
      >
        <Form
          ref={formRef}
          model={formState.value}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          {...props.formProps}
        >
          {/* 配置表单项 */}
          {props.fields.map(field => renderField(field))}

          {/* 默认插槽 */}
          {slots.default?.()}
        </Form>
      </Drawer>
    )
  }
})
