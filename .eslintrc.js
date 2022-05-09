module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: ["eslint-config-airbnb-base"],
  
    rules: {
      quotes: ["error", "single", { allowTemplateLiterals: true }],
      "no-use-before-define": ["error", { functions: false, variables: false }],
      "no-restricted-syntax": [
        "error",
        "WithStatement",
        "BinaryExpression[operator='in']",
      ],
      "import/extensions": [2, "ignorePackages", { js: "always" }],
      "object-curly-newline": ["error", { multiline: true }],
    },
  };
