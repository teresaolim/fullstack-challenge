import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import airbnbConfig from 'eslint-config-airbnb';
import airbnbHooksConfig from 'eslint-config-airbnb/rules/react-hooks';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // ES2020
      globals: {
        ...globals.browser, // For browser-specific globals
        ...globals.node, // For Node.js-specific globals like 'require' and 'module'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module', // Support ES Modules
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...airbnbConfig.rules, // Airbnb base rules
      ...airbnbHooksConfig.rules, // Airbnb React Hooks rules

      // Custom overrides
      'no-console': 'off', // Allow console.log
      'react/react-in-jsx-scope': 'off', // React 17+ doesn't require React import
      'react/jsx-props-no-spreading': 'off', // Allow props spreading
    },
  },
];
