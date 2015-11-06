import { Component } from 'react';

import Editor from './Editor';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Editor />
      </div>
    );
  }
}
