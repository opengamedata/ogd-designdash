module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
