import { Component, createElement } from 'react';
import Renderer from 'mobiledoc-html-renderer/lib';

import Editor from './Editor';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobiledoc: {},
      content: ''
    };
  }

  componentWillMount() {
    this.cards = {};
    this.renderer = new Renderer();
  }

  onContentChange(content) {
    this.setState({
      mobiledoc: content,
      content: this.renderer.render(content, this.cards)
    });
  }

  render() {
    const { content, mobiledoc } = this.state;

    return (
      <div>
        <header>
          <h1>React Content-Kit</h1>
          <p className="subheader">
            A react implementation of <a href="https://github.com/bustlelabs/content-kit-editor">Content Kit Editor</a>
          </p>

          <hr/>
        </header>

        <h2>Editor</h2>
        <Editor onChange={this.onContentChange.bind(this)} />

        <h2>Rendered Output</h2>
        <div className="rendered-content-wrapper">
          { createElement('div', {
            className: 'rendered-content',
            dangerouslySetInnerHTML: { __html: content }
          })}
        </div>

        <h2>Mobiledoc Output</h2>
        <div className="mobiledoc-output-wrapper">
          <pre>{ JSON.stringify(mobiledoc, null, 2) }</pre>
        </div>
      </div>
    );
  }
}
