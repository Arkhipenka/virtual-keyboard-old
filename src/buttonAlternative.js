import Button from './button.js';

class ButtonAlternative extends Button {
  constructor(
    text = { en: 'a', ru: 'а' },
    lang = 'en',
    altText = { en: 'A', ru: 'А' },
    code = 'KeyA',
  ) {
    super(text, lang, altText, code);
    this.shifted = false;
  }

  shift() {
    [this.text, this.altText] = [this.altText, this.text];
    this.changeText();
    this.node.classList.toggle('shift');
  }

  caps() {
    this.node.classList.toggle('shift');
  }
}

export default ButtonAlternative;
