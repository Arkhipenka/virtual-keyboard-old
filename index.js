class keyboard {
  constructor() {
    this.capslock = false;
    this.shift = false;
    this.lang = localStorage.getItem("lang") || "EN";
    this.textArea = document.createElement("textarea");
  }
  init() {}
}

window.onload = () => {
  const keyboard = new keyboard();
  keyboard.init();
};
