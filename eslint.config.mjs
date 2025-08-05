import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores(['coverage/']),
  { 
    files: ['**/*.{js,mjs,cjs}'], 
    plugins: { 
      js,
      importPlugin
    }, 
    extends: ['js/recommended'], 
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'importPlugin/no-commonjs': ['error', { 'allowRequire': false }],
    },
  },
]);
