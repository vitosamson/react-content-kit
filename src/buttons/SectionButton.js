import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import classnames from 'classnames';

export default class SectionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }
  }

  static propTypes = {
    editor: PropTypes.instanceOf(Editor),
    icon: PropTypes.string,
    title: PropTypes.string,
    markup: PropTypes.oneOf(['p', 'h3', 'h2', 'h1', 'blockquote', 'pull-quote']),
    onClick: PropTypes.func,
    isActive: PropTypes.func
  }

  componentWillMount() {
    const { editor, markup } = this.props;
    // const { post, cursor } = editor;
    let active;

    editor.cursorDidChange(() => {
      if (editor.activeSections.length === 0) {
        return;
      }

      const tagNames = editor.activeSections.map(section => section.tagName);
      active = tagNames.indexOf(markup) > -1;

      this.setState({
        active
      });
    });
  }

  onClick() {
    const {
      onClick,
      markup
    } = this.props;

    if (onClick) {
      this.props.editor.run(onClick);
    } else if (markup) {
      this.toggleSection();
    }
  }

  toggleSection() {
    const {
      editor,
      markup
    } = this.props;

    const { activeSections } = editor;

    editor.run(postEditor => {
      activeSections.map(section => {
        if (section.tagName === markup) {
          postEditor.resetSectionTagName(section);
        } else {
          postEditor.changeSectionTagName(section, markup);
        }

        postEditor.scheduleAfterRender(() => {
          editor.selectSections(activeSections);
        });
      });
    });
  }

  isActive() {
    const { isActive, editor } = this.props;
    const { active } = this.state;

    return active || isActive && isActive(editor);
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
