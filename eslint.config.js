// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const ignoredPaths = [
  'coverage/**',
  'dist/**',
  'node_modules/**',
  'playwright-report/**',
  'storybook-static/**',
  'test-results/**',
  '.vite/**',
  '.vite-temp/**',
  'node_modules/.cache/**',
  'node_modules/.vite/**',
  'node_modules/.vite-temp/**',
]

const browserFiles = [
  'src/**/*.{ts,tsx}',
  'stories/**/*.{ts,tsx}',
  'tests/**/*.{ts,tsx}',
  '.storybook/preview.{ts,tsx}',
]

const nodeFiles = [
  'scripts/**/*.{js,mjs,ts,tsx}',
  '*.config.{js,mjs,ts}',
  'eslint.config.js',
  '.storybook/main.{ts,tsx}',
]

const typeScriptFiles = [
  'src/**/*.{ts,tsx}',
  'scripts/**/*.{ts,tsx}',
  'tests/**/*.{ts,tsx}',
  'stories/**/*.{ts,tsx}',
  '.storybook/**/*.{ts,tsx}',
  '*.config.ts',
]

const javaScriptFiles = [
  'scripts/**/*.{js,mjs}',
  '*.config.{js,mjs}',
  'eslint.config.js',
]

const unusedVarsOptions = {
  argsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
  ignoreRestSiblings: true,
  varsIgnorePattern: '^_',
}

const sharedPlugins = {
  'simple-import-sort': simpleImportSort,
}

const sharedRules = {
  'simple-import-sort/exports': 'error',
  'simple-import-sort/imports': 'error',
}

export default tseslint.config(
  {
    ignores: ignoredPaths,
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: browserFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: nodeFiles,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: javaScriptFiles,
    extends: [js.configs.recommended],
    plugins: sharedPlugins,
    rules: {
      ...sharedRules,
      'no-unused-vars': ['error', unusedVarsOptions],
    },
  },
  {
    files: typeScriptFiles,
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      ...sharedPlugins,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...sharedRules,
      '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
      'no-unused-vars': 'off',
    },
  },
  eslintConfigPrettier,
  storybook.configs['flat/recommended'],
)
