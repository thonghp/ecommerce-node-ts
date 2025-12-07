import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': 'off', // Tắt rule no-unused-vars
      'no-unsafe-optional-chaining': 'off', // Tắt rule no-unsafe-optional-chaining
      'no-constant-condition': 'off', // Tắt rule no-constant-condition
      'no-useless-catch': 'off', // Tắt rule no-useless-catch
      'no-empty': 'off', // Tắt rule no-empty
      'no-undef': 'off',
      curly: ['error', 'all'], // Bắt buộc dùng dấu ngoặc cho if, else, for...
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: 'if', next: '*' }]
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        ...globals.node // Thêm global node, bao gồm process
      }
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser
    }
  }
])
