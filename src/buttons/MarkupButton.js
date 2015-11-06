import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import classnames from 'classnames';

export default class MarkupButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      editor: props.editor
    };
  }

  static propTypes = {
    editor: PropTypes.instanceOf(Editor),
    icon: PropTypes.string,
    title: PropTypes.string,
    markup: PropTypes.oneOf(['b', 'i', 'strong', 'em', 'a', 'u', 'sub', 'sub', 's', 'del']),
    onClick: PropTypes.func,
    isActive: PropTypes.func
  }

  componentWillMount() {
    const { editor, markup } = this.props;
    const { post, cursor } = editor;
    let active;

    editor.cursorDidChange(() => {
      if (cursor.activeSections.length === 0) {
        return;
      }

      const markups = post.markupsInRange(cursor.offsets).map(markup => markup.tagName);
      active = markups.indexOf(markup) > -1;

      this.setState({
        active
      });
    });
  }

  isActive() {
    const { isActive, editor } = this.props;
    const { active } = this.state;

    return active || isActive && isActive(editor);
  }

  onClick() {
    const {
      onClick,
      markup
    } = this.props;

    if (onClick) {
      this.props.editor.run(onClick);
    } else if (markup) {
      this.toggleMarkup();
    }
  }

  toggleMarkup() {
    const { editor, markup } = this.props;

    if (!editor) return;

    editor.run(postEditor => {
      postEditor.toggleMarkup(markup);
    });
  }

  render() {
    const {
      icon,
      title
    } = this.props;

    const { active } = this.state;
    const buttonClass = classnames('toolbar-button', {
      active: this.isActive()
    });

    return (
      <button className={buttonClass} onClick={this.onClick.bind(this)}>
        <i className={icon} />
        { title }
      </button>
    );
  }
}
