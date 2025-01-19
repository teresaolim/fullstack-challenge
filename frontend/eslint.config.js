import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore build artifacts
  { ignores: ['dist'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Use ES2020 features
      globals: globals.browser, // Browser-specific globals like 'window'
      parserOptions: {
        ecmaVersion: 'latest', // Allow modern ECMAScript features
        ecmaFeatures: { jsx: true }, // Enable JSX
        sourceType: 'module', // Use ES modules
      },
    },
    settings: { react: { version: '18.3' } }, // Specify React version
    plugins: {
      react, // React plugin for linting JSX
      'react-hooks': reactHooks, // React Hooks plugin
      'react-refresh': reactRefresh, // React Refresh plugin
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // React-specific rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      'react/jsx-no-target-blank': 'off', // Allow target="_blank" without rel="noreferrer"
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Airbnb rules
      'no-console': 'off', // Allow console.log statements for debugging
      'react/react-in-jsx-scope': 'off', // Disable for React 17+ (no need to import React)
      'react/jsx-props-no-spreading': 'off', // Allow props spreading
    },
    extends: [
      'airbnb', // Airbnb React rules
      'airbnb/hooks', // Airbnb Hooks rules
    ],
  },
];
