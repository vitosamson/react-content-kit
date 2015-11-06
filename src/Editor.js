import { Component, PropTypes } from 'react';
import ContentKit from 'content-kit-editor';

import Toolbar from './Toolbar';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  static propTypes = {
    showToolbar: PropTypes.bool,
    toolbarButtons: PropTypes.array
  }

  static defaultProps = {
    showToolbar: true,
    toolbarButtons: [
      ['strong', 'em'],
      ['ol', 'ul'],
      ['h3', 'blockquote', 'link'],
      [{
        markup: 'h1',
        icon: 'fa fa-header'
      }]
    ]
  }

  componentDidMount() {
    const { toolbarButtons } = this.props;
    const simpleMobiledoc = {
      version: "0.1",
      sections: [[], [
        [1, "p", [
          [[], 0, "Welcome to Content-Kit"]
        ]]
      ]]
    };

    this.editor = new ContentKit.Editor({
      mobiledoc: simpleMobiledoc
    });

    this.setState({
      editor: this.editor,
      toolbarButtons
    });

    this.editor.render(this.refs.editor);

    // for the debugs
    window.editor = this.editor;
  }

  render() {
    const { showToolbar, toolbarButtons } = this.props;

    return (
      <div className="editor-wrapper">
        { showToolbar && <Toolbar editor={this.state.editor} buttons={toolbarButtons} /> }
        <div className="editor" ref="editor"></div>
      </div>

    );
  }
}
