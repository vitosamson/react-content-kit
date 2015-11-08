export default {
  name: 'image',
  display: {
    setup(element, options, env, payload) {
      const imgWrapper = document.createElement('div');
      const removeButton = document.createElement('div');
      const img = document.createElement('img');

      imgWrapper.classList.add('image-card');
      removeButton.classList.add('remove-button');
      removeButton.innerHTML = '&times;';
      img.setAttribute('src', payload.src);

      imgWrapper.appendChild(removeButton);
      imgWrapper.appendChild(img);
      element.appendChild(imgWrapper);

      removeButton.addEventListener('click', env.remove);
      // dragging the image around the editor causes problems
      img.addEventListener('dragstart', e => e.preventDefault());

      return imgWrapper;
    },
    teardown(element) {
      element.parentNode.removeChild(element);
    }
  }
}
