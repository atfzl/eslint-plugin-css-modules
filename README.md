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

## Note

It ignores the class names starting with _

## Screen Shot

![ScreenShot](https://raw.githubusercontent.com/atfzl/eslint-plugin-css-modules/master/screenshots/screenshot2.png)

```
  1:8   error  Unused classes found: container, button  css-modules/no-unused-or-extra-class
  4:17  error  Class 'containr' not found               css-modules/no-unused-or-extra-class
  7:26  error  Class 'foo' not found                    css-modules/no-unused-or-extra-class
```

scss:

```scss
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
