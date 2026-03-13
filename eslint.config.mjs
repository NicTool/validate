import globals from 'globals'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['**/package-lock.json', 'node_modules/**', '.release/**'],
  },
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
  },
]
