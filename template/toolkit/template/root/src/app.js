'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { Ajax } from './util/index';
import './index.less';

class Home extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      text: ''
    };
  }

  componentDidMount() {

    Ajax('home', (json) => {
      this.setState({
        text: json.data
      });
    });
  }

  render() {
    return (
      <div className="init-template">{this.state.text}</div>
    );
  }
}

ReactDom.render(
  <Home />,
  document.getElementById('container')
);
