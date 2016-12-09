# eslint-plugin-css-modules

This plugin intends to help you in tracking down problems when you are using css-modules. It tells if you are using a non-existent css/scss class in js or if you forgot to use some classes which you declared in css/scss.

## Rules

* `css-modules/no-unused-or-extra-class`: You must not use a non existing class and must use all existing classes from css/scss file.

## Installation

```
npm i --save-dev eslint-plugin-css-modules
```

## Usage:

.eslintrc
```json
{
  "plugins": [
    "css-modules"
  ],
  "extends": [
    "plugin:css-modules/recommended"
  ]
}
```
