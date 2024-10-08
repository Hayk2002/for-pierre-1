const fs = require("fs");
const path = require("path");

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, ".prettierrc"), "utf8"),
);

module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  extends: ["airbnb", "airbnb/hooks", "prettier"],
  plugins: ["prettier", "react", "react-hooks", "jsx-a11y"],
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  rules: {
    "prettier/prettier": [1, { ...prettierOptions, endOfLine: "auto" }], // 1 change to "error"
    "arrow-body-style": [2, "as-needed"],
    "class-methods-use-this": 0,
    "import/imports-first": 0,
    "import/newline-after-import": 0,
    "import/no-dynamic-require": 0,
    "import/no-named-as-default": 0,
    "import/no-unresolved": [0, { ignore: ["^@/", "^~/"] }],
    "import/no-webpack-loader-syntax": 0,
    "import/prefer-default-export": 0,
    "import/extensions": 0,
    "jsx-a11y/aria-props": 2,
    "jsx-a11y/heading-has-content": 0,
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        // NOTE: If this error triggers, either disable it or add
        // your custom components, labels and attributes via these options
        // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        controlComponents: ["Input"],
      },
    ],
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/mouse-events-have-key-events": 2,
    "jsx-a11y/role-has-required-aria-props": 2,
    "jsx-a11y/role-supports-aria-props": 2,
    "max-len": 0,
    "newline-per-chained-call": 0,
    "no-confusing-arrow": 0,
    "no-console": 1,
    "no-unused-vars": 1,
    "no-use-before-define": 0,
    "prefer-template": 2,
    "react/destructuring-assignment": 0,
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-closing-tag-location": 0,
    "react/jsx-first-prop-new-line": [2, "multiline"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/jsx-props-no-spreading": 0,
    "react/jsx-no-target-blank": 0,
    "react/jsx-uses-vars": 2,
    "react/require-default-props": 0,
    "react/require-extension": 0,
    "react/self-closing-comp": 0,
    "react/sort-comp": 0,
    "require-yield": 0,
    "react/prop-types": 0,
    "import/no-cycle": 0,
    "import/no-extraneous-dependencies": 0,
    "react/no-array-index-key": 1,
    "no-param-reassign": 1,
    "no-return-assign": 0,
    "prefer-promise-reject-errors": 1,
    "no-debugger": 1,
    "no-restricted-syntax": [0, "ForOfStatement"],
    "react/no-danger": 0,
    "react/react-in-jsx-scope": 0,
    "react/function-component-definition": [
      1,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/no-unescaped-entities": 0,
    "default-param-last": 0,
    "func-names": 0,
  },
};
