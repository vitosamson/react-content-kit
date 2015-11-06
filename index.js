import ContentKit from 'content-kit-editor';
import Toolbar from 'content-kit-editor/dist/commonjs/content-kit-editor/views/toolbar';

var simpleMobiledoc = {
  version: "0.1",
  sections: [[], [
    [1, "p", [
      [[], 0, "Welcome to Content-Kit"]
    ]]
  ]]
};

const editor = new ContentKit.Editor({
  mobiledoc: simpleMobiledoc,
  stickyToolbar: true
});
editor.render(document.getElementById('editor'));

const toolbar = new Toolbar.default({
  editor
})

window.toolbar = toolbar;

window.editor = editor;

// editor.didUpdatePost(postEditor => {
//   console.log(postEditor);
//   postEditor.toggleMarkup('strong');
//   // let { offsets } = editor.offsets;
//   // let cursorSection;

//   // if (offsets.headSection.text === 'add-section-when-i-type-this') {
//   //   let section = editor.builder.createMarkupSection('p');
//   //   postEditor.insertSectionBefore(section, cursorSection.next);
//   //   cursorSection = section;
//   // }

//   // postEditor.scheduleRerender();
//   // postEditor.schedule(() => {
//   //   if (cursorSection) {
//   //     editor.moveToSection(cursorSection, 0);
//   //   }
//   // });
// });

// editor.registerExpansion({
//   trigger: ' ',
//   text: 'foo',
//   run(editor) {
//     console.log('expand');
//     console.log(editor)
//   }
// })
