# babel-plugin-react-templates

[![Build Status](https://travis-ci.org/arbolista-dev/babel-plugin-react-templates.svg?branch=master)](https://travis-ci.org/arbolista-dev/babel-plugin-react-templates)

Import your React Templates with Babel for server side rendering.

## Installation

```sh
$ npm install babel-plugin-react-templates
```

## Usage

### Options

Plugin options are passed to `reactTemplates.convertTemplateToReact`.

There is also an `ext` option for you to specify the extension you want to be compiled by React Templates (the default is `template.html`.

### `.babelrc`

**.babelrc**

```json
{
  "presets": ["es2015"],
  "plugins": ["react-templates", {"targetVersion": "0.14.0", "ext": "rt"}]
}
```

This plugin does requires Babel ES2015 preset. If you want to make this work without ES2015, PR's are very welcome.

## Notes

This Babel plugin requires you to import your template dependencies BEFORE your templates. For example,

```js
import React from 'react';
import _ from 'lodash';
import OtherComponent from './../other_component/other_component';

import template from './my_component.template.html';

class MyComponent extends React.Component{
  // ...
  render(){
    return template.call(this);
  }
  // ...
}

```

This means you should NOT rely on it to compile React Templates for webpack. Use [react-templates-loader](https://www.npmjs.com/package/react-templates-loader) for client side compiling.

Why? Because this Babel plugin assumes your dependencies are accessible by the variable names you use in your template. For example, the plugin would compile the above file as:


```js
import React from 'react';
import _ from 'lodash';
import OtherComponent from './other_component';

// begin babel-plugin-react-templates result
var template = function () {
    return React.createElement('h1', {}, 'Hello World');
};
// end babel-plugin-react-templates result

class MyComponent extends React.Component{
  // ...
  render(){
    return template.call(this);
  }
  // ...
}

```
This means you have to declare your dependencies twice if you are compiling for client as well. Annoying. PRs are welcome.
