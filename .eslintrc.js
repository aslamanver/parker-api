module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
    "require-jsdoc": 0,
    "quote-props": 0,
    "object-curly-spacing": 0,
    "max-len": 0,
    "space-before-function-paren": 0,
  },
};
