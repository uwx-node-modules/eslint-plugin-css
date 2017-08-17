# eslint-plugin-css

Lint CSS files (using stylelint)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-css`:

```
$ npm install eslint-plugin-css --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-css` globally.

## Usage

Add `css` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "css"
    ]
}
```

You can run ESLint on individual CSS files or you can use the `--ext` flag to add CSS files to the list.

```
eslint . --ext .css --ext .js
eslint example.json
```





