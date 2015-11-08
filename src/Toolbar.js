import { Component, PropTypes, isValidElement, cloneElement } from 'react';
import assign from 'object.assign';

import {
  MarkupButton,
  SectionButton,
  ListButton,
  LinkButton,
  BUILTIN_BUTTONS
} from './buttons';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]))),
    onFileSelect: PropTypes.func
  }

  render() {
    const { buttons, editor, onFileSelect } = this.props;

    const buttonGroups = buttons;

    if (!editor) return false;

    return (
      <div className="toolbar">
        { buttonGroups.map((buttonGroup, idx) => {
          return (
            <span key={idx}>
              { buttonGroup.map((button, idx) => {
                let ButtonComponent;
                let buttonConfig;

                if ('string' === typeof button && button in BUILTIN_BUTTONS) {
                  ButtonComponent = BUILTIN_BUTTONS[button].button;
                  buttonConfig = BUILTIN_BUTTONS[button];

                  if (button === 'image') {
                    buttonConfig.onFileSelect = onFileSelect;
                  }
                } else if ('object' === typeof button && !isValidElement(button)) {
                  ButtonComponent = BUILTIN_BUTTONS[button.markup].button;
                  buttonConfig = assign({}, BUILTIN_BUTTONS[button.markup], button);

                  if (!ButtonComponent) return;
                } else { // TODO: allow custom buttons
                  return;
                }

                return (<ButtonComponent {...buttonConfig} editor={editor} key={idx} />)
              })}

              {(idx < buttonGroups.length - 1) &&
                <span className="toolbar-separator"></span>
              }
            </span>
          );
        })}
      </div>
    );
  }
}
