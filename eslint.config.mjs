import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import security from 'eslint-plugin-security'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist', '.next', 'ios', 'node_modules', 'out', 'playwright-report'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'max-lines': ['error', 300],
      'max-lines-per-function': ['error', 150],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Test files: relax line limits since test suites are naturally verbose
  {
    files: ['src/test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Config and script files: relax unused-vars for conventional patterns
  {
    files: ['*.config.{js,mjs,ts}', 'scripts/**/*.mjs', 'next-sitemap.config.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'max-lines': 'off',
    },
  },
  // Complex components that legitimately exceed line limits
  {
    files: [
      'src/components/PhoneDetector.tsx',
      'src/components/KioskDisplay.tsx',
      'src/components/RecordingPreviewModal.tsx',
      'src/lib/site-config.ts',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  // Auth pages with form-heavy components
  {
    files: ['src/app/(auth)/**/*.tsx'],
    rules: {
      'max-lines-per-function': ['error', 200],
    },
  },
  prettier,
)
