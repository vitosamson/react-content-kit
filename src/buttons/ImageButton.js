import { Component, PropTypes } from 'react';
import { Editor } from 'content-kit-editor';
import classnames from 'classnames';

import ImageCard from '../cards/ImageCard';

export default class ImageButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false
    }
  }

  static propTypes = {
    icon: PropTypes.string,
    onFileSelect: PropTypes.func,
    editor: PropTypes.instanceOf(Editor)
  }

  componentWillMount() {
    const { editor } = this.props;

    editor.cards.unshift(ImageCard);
  }

  onFileChange(e) {
    const { onFileSelect } = this.props;
    const { input, form } = this.refs;

    if (onFileSelect) {
      onFileSelect(input.files, this.addImageCard.bind(this));

      this.setState({
        uploading: true
      });

      form.reset();
    }
  }

  addImageCard(imageUrl) {
    const { editor } = this.props;
    const card = editor.builder.createCardSection('image', {src: imageUrl});

    editor.run(postEditor => {
      postEditor.insertSection(card);

      postEditor.scheduleAfterRender(() => {
        this.setState({
          uploading: false
        });
      });
    });
  }

  render() {
    const { uploading } = this.state;
    const icon = classnames({
      [this.props.icon]: !uploading,
      'fa fa-spin fa-spinner': uploading
    });

    return (
      <button className="toolbar-button" type="button">
        <form onSubmit={() => false} ref="form">
          <label htmlFor="toolbar-file-input" style={{cursor: 'pointer'}}>
            <i className={icon}/>
          </label>
          
          <input type="file" style={{display: 'none'}} id="toolbar-file-input" ref="input" onChange={this.onFileChange.bind(this)} accept="image/*" />
        </form>
      </button>
    );
  }
}
