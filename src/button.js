class button {
  constructor(
    text = { en: "a", ru: "а" },
    lang = "en",
    altText = { en: "A", ru: "А" },
    code = "KeyA"
  ) {
    this.node = null;
    this.text = text;
    this.lang = lang;
    this.altText = altText;
    this.code = code;
  }

  init() {
    this.node = document.createElement("button");
    this.node.classList.add("key");
    this.node.dataset.button = this.text.en;

    this.changeText();
  }

  changeText() {
    this.node.innerHTML = this.text[this.lang];
  }

  changeLanguage(lang) {
    this.lang = lang;
    this.changeText();
  }

  shift() {
    this.node.classList.remove("shift");
  }

  caps() {
    this.node.classList.remove("shift");
  }
}

export default button;
