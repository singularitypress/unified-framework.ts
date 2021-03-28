module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "standard",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-unused-vars": 0,
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      },
    ],
    "arrow-parens": ["error", "always"],
    "space-before-function-paren": ["error", {
      anonymous: "always",
      named: "always",
      asyncArrow: "always",
    }],
    "@typescript-eslint/explicit-member-accessibility": 2,
    "no-use-before-define": [0],
    "@typescript-eslint/no-use-before-define": [1],
  },
};
