import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

export default class LinkButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linkFieldOpen: false,
      currentHref: null
    }
  }

  static propTypes = {
    icon: PropTypes.string,
    onClick: PropTypes.func,
    isActive: PropTypes.func,
    editor: PropTypes.instanceOf(Editor)
  }

  static defaultProps = {
    icon: 'fa fa-link'
  }

  componentWillMount() {
    this.props.editor.registerKeyCommand({
      str: 'META+K',
      run: () => {
        if (!this.state.linkFieldOpen) {
          this.openLinkField();
        }
      }
    });
  }

  toggleLinkField() {
    const { linkFieldOpen } = this.state;

    if (linkFieldOpen)
      this.closeLinkField();
    else
      this.openLinkField();
  }

  openLinkField() {
    const { cursor, activeSection } = this.props.editor;
    const range = cursor.offsets;
    const selectedText = cursor.selectedText();
    const marker = range.headMarker;
    const closeLinkField = this.closeLinkField.bind(this);
    const { wrapper } = this.refs;
    let currentHref;
    
    if (!activeSection)
      return;

    if (marker) {
      let anchors = marker.markups.filter(markup => markup.tagName === 'a');
      if (anchors.length) {
        currentHref = anchors[0].attributes.href;
      }
    }

    this.setState({
      linkFieldOpen: true,
      range,
      selectedText,
      activeSection,
      currentHref
    }, () => {
      function close(e) {
        if (!wrapper.contains(e.target)) {
          closeLinkField();
          window.removeEventListener('click', close);
        }
      }

      window.addEventListener('click', close);
    });
  }

  closeLinkField() {
    const { editor } = this.props;
    const { range } = this.state;

    if (range) {
      editor.selectRange(range);
    }

    this.setState({
      linkFieldOpen: false,
      range: null
    });
  }

  removeLink() {
    const { range, selectedText, activeSection, currentHref } = this.state;
    const { editor } = this.props;
    const { builder, cursor } = editor;
    const { headMarker, headMarkerOffset } = range;

    editor.run(postEditor => {
      const markups = headMarker.markups.filter(markup => markup.tagName !== 'a');
      const marker = builder.createMarker(headMarker.value, markups);
      let newSection;

      activeSection.markers.splice(headMarker, 1, [marker]);
      newSection = activeSection.clone();

      postEditor.replaceSection(activeSection, newSection);
      postEditor.scheduleAfterRender(() => {
        range.head.section = newSection;
        cursor.moveToPosition(range.head);
      });
    });

    this.setState({
      linkFieldOpen: false,
      range: null,
      currentHref: null
    });
  }

  /**
   * TODO:
   * fix css
   */

  addLink(href) {
    const { range, selectedText, activeSection, currentHref } = this.state;
    const { editor } = this.props;
    const { builder, cursor } = editor;
    const link = builder.createMarkup('a', {href});
    const { headMarker, headMarkerOffset } = range;

    editor.run(postEditor => {
      if (currentHref) { // already in a link, just update its href
        const marker = builder.createMarker(headMarker.value, [link]);
        let newSection;

        activeSection.markers.splice(headMarker, 1, [marker]);
        newSection = activeSection.clone();

        postEditor.replaceSection(activeSection, newSection);

        postEditor.scheduleAfterRender(() => {
          range.head.section = newSection;
          cursor.moveToPosition(range.head);
        });
      } else if (selectedText) { // wrap the selected text
        postEditor.addMarkupToRange(range, link);

        postEditor.scheduleAfterRender(() => {
          range.head.offset += selectedText.length;
          cursor.moveToPosition(range.head);
        });
      } else { // insert the href as the text
        let newSection;
        const marker = builder.createMarker(href, [link]);

        // split the current marker so we can insert the link at the cursor itself, not end of section
        if (headMarker) {
          const { beforeMarker, afterMarker } = postEditor.splitMarker(headMarker, headMarkerOffset);
          activeSection.markers.insertAfter(marker, beforeMarker);
        } else {
          activeSection.markers.append(marker);
        }

        newSection = activeSection.clone();
        postEditor.replaceSection(activeSection, newSection);
        
        postEditor.scheduleAfterRender(() => {
          range.head.section = newSection;
          range.head.offset += marker.length;
          cursor.moveToPosition(range.head);
        });
      }

      this.setState({
        linkFieldOpen: false,
        currentHref: null
      });
    });
  }

  render() {
    const {
      icon,
      editor
    } = this.props;

    const { linkFieldOpen, currentHref } = this.state;

    const buttonClass = classnames('toolbar-button');

    return (
      <div className="link-button-wrapper" ref="wrapper">
        <button className={buttonClass} onClick={this.toggleLinkField.bind(this)} ref="button" type="button">
          <i className={icon} />
        </button>

        <LinkFieldTooltip
          show={linkFieldOpen}
          onAddLink={this.addLink.bind(this)}
          onClose={this.closeLinkField.bind(this)}
          onRemoveLink={this.removeLink.bind(this)}
          currentHref={currentHref}
        />
      </div>
    );
  }
}

class LinkFieldTooltip extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { inputField } = this.refs;
    const { onClose } = this.props;

    if (this.props.show === true) {
      setTimeout(() => inputField.focus());

      function close(e) {
        if (e.keyCode === 27) {
          onClose();
          inputField.removeEventListener('keyup', close);
        }
      }

      inputField.addEventListener('keyup', close);
    }
  }

  addLink(e) {
    e.preventDefault();

    if (this.props.onAddLink) {
      this.props.onAddLink(this.refs.inputField.value);
    }

    this.refs.inputField.value = '';
  }

  onClose() {
    const { onClose, onRemoveLink, currentHref } = this.props;

    if (currentHref) {
      onRemoveLink();
    } else {
      onClose();
    }
  }

  render() {
    const { show, currentHref } = this.props;

    if (!show) return false;

    return (
      <div className="ck-tooltip toolbar-link-tooltip">
        <form onSubmit={this.addLink.bind(this)}>
          <input type="text" ref="inputField" defaultValue={currentHref} />
          <i className="confirm fa fa-check" onClick={this.addLink.bind(this)}></i>
          <i className="cancel fa fa-times" onClick={this.onClose.bind(this)}></i>
        </form>
      </div>
    );
  }
}
