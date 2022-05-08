import button from './button.js';

class buttonWord extends button {
  constructor(
    text = { en: 'a', ru: 'а' },
    lang = 'en',
    altText = { en: 'A', ru: 'А' },
    code = 'KeyA',
  ) {
    super(text, lang, altText, code);
  }

  shift() {
    this.node.classList.toggle('shift');
  }

  caps() {
    this.node.classList.toggle('shift');
  }
}

export default buttonWord;