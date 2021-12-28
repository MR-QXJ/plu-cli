module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'prettier/prettier': "error"
  }
};