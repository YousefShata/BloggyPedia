/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
    {
      languageOptions: {
        globals: {
          Atomics: 'readonly',
          SharedArrayBuffer: 'readonly',
        },
        parserOptions: {
          ecmaVersion: 2018,
          sourceType: 'module',
        },
      },
      plugins: ['jest', 'prettier'],
      extends: [
        'plugin:jest/all',
      ],
      rules: {
        'prettier/prettier': 'error', // Using 'error' as shorthand for 2
        'max-classes-per-file': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        'no-shadow': 'off',
        'no-restricted-syntax': [
          'error',
          'LabeledStatement',
          'WithStatement',
        ],
      },
      overrides: [
        {
          files: ['*.js'],
          excludedFiles: 'babel.config.js',
        },
      ],
    },
  ];
  