import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Async data-fetch pattern (yukle().catch(setHata)) bu kuralı false-positive
      // tetikliyor — cancellation flag ile pratikte güvenli, warning'e düşürdük.
      'react-hooks/set-state-in-effect': 'warn',
      // useEffect içinden component oluşturmak gerçek bir bug — error kalır.
      // 'react-hooks/no-create-component-during-render' default'da error.
    },
  },
  // Edge function'lar için Deno ortamı + esnek tipleme
  {
    files: ['supabase/functions/**/*.ts'],
    languageOptions: {
      globals: {
        Deno: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
