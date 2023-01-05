/** @type {import("eslint").Linter.Config} */

module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        'airbnb',
        'airbnb-typescript',
        "eslint:recommended",
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        project: ['./tsconfig.json']
    },
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        "semi:": "off",
        "import/prefer-default-export": "off",
    }
}
