import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
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
    } 
  },
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'importPlugin/no-commonjs': ['error', { 'allowRequire': false }],
    },
  },
]);
