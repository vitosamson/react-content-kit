import { Component, createElement } from 'react';
import Renderer from 'mobiledoc-html-renderer/lib';

import Editor from './Editor';
import { imgurClientId } from './config';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobiledoc: {},
      content: '',
      uploading: false,
      uploadProgress: 0
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

  onFileSelect(files, cb) {
    const file = files[0];
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    if (!file) return;

    formData.append('image', file);
    xhr.open('post', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
    xhr.addEventListener('load', (e) => {
      const res = JSON.parse(e.target.response);
      cb(res.data.link);

      this.setState({
        uploading: false,
        uploadProgress: 0
      });
    });
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        this.setState({
          uploadProgress: (e.loaded / e.total) * 100
        });
      }
    });

    this.setState({
      uploading: true
    }, () => {
      xhr.send(formData);
    });
  }

  render() {
    const { content, mobiledoc, uploading, uploadProgress } = this.state;

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

        { uploading &&
          <div className="upload-progress">
            <div className="progress" style={{width: `${uploadProgress}%`}}></div>
          </div>
        }

        <Editor onChange={this.onContentChange.bind(this)} onFileSelect={this.onFileSelect.bind(this)} />

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
