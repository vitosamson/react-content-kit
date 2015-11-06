import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import classnames from 'classnames';

export default class ListButton extends Component {
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
    markup: PropTypes.oneOf(['ul', 'ol']),
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

      active = editor.activeSection.tagName === 'li' && editor.activeSection.parent.tagName === markup;

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
    const { onClick } = this.props;

    if (onClick) {
      this.props.editor.run(onClick);
    } else {
      this.toggleList();
    }
  }

  toggleList() {
    const {
      editor,
      markup
    } = this.props;

    const { activeSection } = editor;

    if (!activeSection) return;

    const listItem = editor.run(postEditor => {
      let listItems;
      let listSection;
      let sectionsToSelect;
      let sectionToReplace;

      // we're already in a list and want to change to a different list
      if (activeSection.tagName === 'li' && activeSection.parent.tagName !== markup) {
        const listItems = activeSection.parent.sections.map(s => s.clone());

        listSection = postEditor.builder.createListSection(markup, listItems);
        sectionToReplace = activeSection.parent;
        sectionsToSelect = [listSection.sections.tail];
      } else if (activeSection.tagName === 'li' && activeSection.parent.tagName === markup) {
        return;
      } else { // not already in a list, so create a list
        const listItem = postEditor.builder.createListItem();
        listSection = postEditor.builder.createListSection(markup, [listItem]);

        activeSection.markers.map(marker => {
          listItem.markers.append(marker.clone());
        });

        sectionToReplace = activeSection;
        sectionsToSelect = [listItem];
      }

      postEditor.replaceSection(sectionToReplace, listSection);

      postEditor.scheduleAfterRender(() => {
        editor.selectSections(sectionsToSelect);
        editor.cursor.selection.collapseToEnd();
      });
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
