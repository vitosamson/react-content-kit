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
    toolbarButtons: PropTypes.array,
    onChange: PropTypes.func,
    onFileSelect: PropTypes.func
  }

  static defaultProps = {
    showToolbar: true,
    toolbarButtons: [
      ['strong', 'em'],
      ['ol', 'ul'],
      ['paragraph', 'blockquote', 'link'],
      ['image']
    ]
  }

  componentDidMount() {
    const { toolbarButtons, onChange } = this.props;

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
    this.setupListeners();

    if (onChange) {
      onChange(this.editor.serialize());
    }

    // for the debugs
    window.editor = this.editor;
  }

  setupListeners() {
    const { onChange } = this.props;

    this.editor.didUpdatePost(postEditor => {
      if (onChange) {
        onChange(postEditor.editor.serialize());
      }
    });
  }

  render() {
    const { showToolbar, toolbarButtons, onFileSelect } = this.props;

    return (
      <div className="editor-wrapper">
        { showToolbar && <Toolbar editor={this.state.editor} buttons={toolbarButtons} onFileSelect={onFileSelect} /> }
        <div className="editor" ref="editor"></div>
      </div>

    );
  }
}
