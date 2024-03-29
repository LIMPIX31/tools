import typescriptEslint       from '@typescript-eslint/eslint-plugin'
import parser                 from '@typescript-eslint/parser'
import jsxA11y                from 'eslint-plugin-jsx-a11y'
import prettier               from 'eslint-plugin-prettier'
import react                  from 'eslint-plugin-react'
import reactHooks             from 'eslint-plugin-react-hooks'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import importSort             from '@lmpx-fork/eslint-plugin-simple-import-sort'

import { rules }              from './rules.js'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
    rules,
    plugins: {
      prettier,
      'import-sort': importSort,
      react,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
      'eslint-plugin-react-hooks': eslintPluginReactHooks,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: {
        pragma: 'React',
        version: '18.2.0',
      },
      propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {},
      parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          generators: false,
          objectLiteralDuplicateProperties: false,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },
] as any
