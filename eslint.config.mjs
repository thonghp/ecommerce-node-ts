import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/node_modules/', '**/dist/'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { parser: tseslint.parser, globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn', // warn off
      curly: ['error', 'all'], // bắt buộc phải có {} sau if, else, while, for, ...
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ],
      // Rule xuống dòng sau if
      'padding-line-between-statements': [
        'error',
        // sau if/else, for, while,...
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' }
        // { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' }
      ],
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true } // sau các method xuống dòng
      ]
    }
  }
]
