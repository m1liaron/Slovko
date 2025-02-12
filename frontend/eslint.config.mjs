import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: [
      '**/node_modules/**',
      '**/.expo/**', // Ignore Expo-generated files
      '**/.expo/**/*', // Ignore all subdirectories in .expo
      '**/babel.config.js/**',
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      strict: "off", // equivalent to [0, "global"]
      "func-names": "off",
      "object-shorthand": "off",
      "consistent-return": "off",
      "prefer-template": "off",
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
        },
      ],
      "no-undef": "off",// Prevents undefined variable errors
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals (fixes "module is not defined"),
        $$require_external: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
