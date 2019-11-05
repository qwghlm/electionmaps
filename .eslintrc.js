module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["babel"],
  extends: [
    "eslint:recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", {
      args: "none",
      ignoreRestSiblings: true
    }],
  },
};
