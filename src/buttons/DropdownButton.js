import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import classnames from 'classnames';

export default class DropdownButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      activeSectionTags: [],
      activeMarkupTags: [],
      activeSections: []
    };
  }

  static propTypes = {
    icon: PropTypes.string,
    editor: PropTypes.instanceOf(Editor),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      markup: PropTypes.string,
      type: PropTypes.oneOf(['section', 'markup'])
    }))
  }

  componentWillMount() {
    const { editor } = this.props;
    const { post, cursor } = editor;

    editor.cursorDidChange(() => {
      if (!cursor.hasCursor()) return;

      this.setState({
        activeSectionTags: editor.activeSections.map(section => section.tagName),
        activeMarkupTags: post.markupsInRange(cursor.offsets).map(markup => markup.tagName)
      });
    });
  }

  toggleMenu() {
    if (this.state.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    const { cursor, activeSections } = this.props.editor;
    const closeMenu = this.closeMenu.bind(this);
    const { wrapper } = this.refs;

    this.setState({
      open: true,
      activeSections,
      range: cursor.offsets
    }, () => {
      function close(e) {
        if (!wrapper.contains(e.target)) {
          closeMenu();
          window.removeEventListener('click', close);
        }
      }

      window.addEventListener('click', close);
    });
  }

  closeMenu() {
    this.setState({
      open: false
    });
  }

  getOptionClass(option) {
    const { activeSectionTags, activeMarkupTags } = this.state;
    let active;

    if (option.type === 'section') {
      active = activeSectionTags.indexOf(option.markup) > -1;
    } else if (option.type === 'markup') {
      active = activeMarkupTags.indexOf(option.markup) > -1;
    }

    return active && 'active';
  }

  onClick(option) {
    const { editor } = this.props;

    if (option.onClick) {
      editor.run(option.onClick);
    } else {
      if (option.type === 'section') {
        this.toggleSection(option.markup);
      } else if (option.type === 'markup') {
        this.toggleMarkup(option.markup);
      }
    }
  }

  toggleSection(markup) {
    const { editor } = this.props;
    const { activeSections } = this.state;

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

    this.closeMenu();
  }

  toggleMarkup(markup) {
    const { editor } = this.props;
    const { range } = this.state;

    editor.run(postEditor => {
      editor.selectRange(range);
      postEditor.toggleMarkup(markup);
    });

    this.closeMenu();
  }

  render() {
    const { icon, options } = this.props;

    const wrapperClass = classnames('toolbar-dropdown-wrapper', {
      open: this.state.open
    });

    return (
      <div className={wrapperClass} ref="wrapper">
        <button className="toolbar-button" onClick={this.toggleMenu.bind(this)} type="button">
          <i className={icon} />
          <i className="fa fa-angle-down" style={{marginLeft: 5}} />
        </button>

        <div className="toolbar-dropdown-menu">
          <ul>
            { options.map((option, idx) => {
              const liClass = this.getOptionClass(option);

              return (
                <li className={liClass} key={idx} onClick={this.onClick.bind(this, option)}>
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
