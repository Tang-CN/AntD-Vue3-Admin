/*
 * ESLint 配置文件
 * 适用于 Vue3 + TypeScript 项目
 */
module.exports = {
  // 指定运行环境
  env: {
    browser: true, // 浏览器环境
    es2021: true, // ES2021 语法支持
    node: true // Node.js 环境
  },

  // 扩展预设规则集
  extends: [
    // ESLint 官方推荐规则
    'eslint:recommended',
    // Vue3 语法支持
    'plugin:vue/vue3-recommended',
    // TypeScript 推荐规则
    'plugin:@typescript-eslint/recommended'
  ],

  // 解析器配置
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest', // 支持最新 ECMAScript 版本
    parser: '@typescript-eslint/parser', // TypeScript 解析器
    sourceType: 'module' // 使用 ES 模块
  },

  // 使用的插件
  plugins: ['vue', '@typescript-eslint'],

  // 自定义规则配置
  rules: {
    // ------------------------------
    // Vue 相关规则
    // ------------------------------
    // 强制 v-if/v-else 分支必须使用唯一key
    'vue/no-duplicate-v-if-else-keys': 'error',
    // 关闭组件名称必须多单词的规则
    'vue/multi-word-component-names': 'off',
    // 允许单个根元素
    'vue/no-v-html': 'warn',
    // vue 模板缩进统一2空格
    'vue/html-indent': ['error', 2],

    // ------------------------------
    // TypeScript 相关规则
    // ------------------------------
    // 允许使用 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // 禁止使用空函数
    '@typescript-eslint/no-empty-function': 'warn',

    // ------------------------------
    // 通用代码规范
    // ------------------------------
    // 允许 console 和 debugger
    'no-console': 'off',
    'no-debugger': 'off',
    // 统一使用单引号
    quotes: ['error', 'single'],
    // 结尾必须分号
    semi: ['error', 'never'],
    // 缩进使用2空格
    indent: ['error', 2],
    // 禁止尾随空格
    'no-trailing-spaces': 'error',
    // 逗号后加空格
    'comma-spacing': 'error',
    // 对象大括号内空格
    'object-curly-spacing': ['error', 'always'],
    // 数组括号内无空格
    'array-bracket-spacing': ['error', 'never']
  },

  // 全局变量
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
