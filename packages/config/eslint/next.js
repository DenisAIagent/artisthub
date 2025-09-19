/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./index.js",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off"
  }
};