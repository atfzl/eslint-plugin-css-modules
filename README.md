# eslint-plugin-css-modules

[![Build Status](https://travis-ci.org/atfzl/eslint-plugin-css-modules.svg?branch=master)](https://travis-ci.org/atfzl/eslint-plugin-css-modules)

This plugin intends to help you in tracking down problems when you are using css-modules. It tells if you are using a non-existent css/scss/less class in js or if you forgot to use some classes which you declared in css/scss/less.

## Rules

* `css-modules/no-unused-class`: You must use all the classes defined in css/scss/less file.

>If you still want to mark a class as used, then use this comment on top of your file
```js
/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['container'] }] */
```
where container is the css class that you want to mark as used.
Add all such classes in the array.

* `css-modules/no-undef-class`: You must not use a non existing class.

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

## Screen Shot

![ScreenShot](https://raw.githubusercontent.com/atfzl/eslint-plugin-css-modules/master/screenshots/screenshot3.png)

```
   1:8   error  Unused classes found: container  css-modules/no-unused-class
   5:17  error  Class 'containr' not found       css-modules/no-undef-class
  10:26  error  Class 'foo' not found            css-modules/no-undef-class
```

scss:

```scss
/* .head is global, will not be used in js */
:global(.head) {
  color: green;
}

.container {
  width: 116px;

  i {
    font-size: 2.2rem;
  }

  .button {
    padding: 7px 0 0 5px;
  }
}

.footer {
  color: cyan;
}
```
