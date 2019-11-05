module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  "parser": "@typescript-eslint/parser",
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
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "args": "none",
        "ignoreRestSiblings": true
      }
    ],
  },
  overrides: [{
    "files": ["*.js"],
    "rules": {
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  }]
};
