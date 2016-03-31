import React from 'react';
import _ from 'lodash';
import Component2 from './component2';

var template = require('./component1.rt.html');

export default class Component1 extends React.Component {

  get prop2(){
    return "more " + this.props.prop1;
  }

  render(){
    console.log('yada!!')
    return template.call(this);
  }

}
