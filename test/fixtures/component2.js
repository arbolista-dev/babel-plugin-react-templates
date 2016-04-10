import React from 'react';
import _ from 'lodash';

var template = require('./component2.rt.html');
// import template from './component2.rt.html';

export default class Component2 extends React.Component {

  render(){
    return template.call(this);
  }

}
