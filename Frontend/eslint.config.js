import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      'no-console': 'warn', // Warn about console logs
      'no-unused-vars': 'warn', // Warn about unused imports/variables
    },
  },
  pluginReact.configs.flat.recommended,
]);
