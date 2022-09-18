module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'space-before-function-paren': 'off',
    'vue/multi-word-component-names': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2]
  }
}
