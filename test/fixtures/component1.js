import React from 'react';
import _ from 'lodash';
import Component2 from './component2';

import template from './component1.template.html';

export default class Component1 extends React.Component {

  get prop2(){
    return "more " + this.props.prop1;
  }

  render(){
    return template.call(this);
  }

}
