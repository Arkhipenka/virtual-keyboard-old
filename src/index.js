import Button from "./button.js";
import ButtonWord from "./buttonWord.js";
import ButtonAlternative from "./buttonAlternative.js";

import arrayButtons from "./arrayButtons.js";
import { isCaps, isShift, runOnKeys, isArrow, isCtrl } from "./utils.js";

class Keyboard {
  constructor() {
    this.capsLock = false;
    this.shift = false;
    this.mouseShift = false;
    this.nodeShift = null;
    this.keys = [];
    this.lang = localStorage.getItem("lang") || "en";
    this.textArea = document.createElement("textarea");
  }

  init() {
    const main = document.createElement("main");

    const keyboardKeys = document.createElement("div");
    keyboardKeys.classList.add("keyboard");
    keyboardKeys.addEventListener("click", this.clickButton.bind(this));

    const info = document.createElement("p");
    info.textContent = `Change Language: 'Alt' + 'Shift'`;

    const infoSystem = document.createElement("p");
    infoSystem.textContent = "ОS: Windows";

    this.textArea.classList.add("text");

    keyboardKeys.append(this.createKeys());
    main.append(infoSystem, info, this.textArea, keyboardKeys);
    document.body.append(main);

    runOnKeys(
      this.changeLang.bind(this),
      ["ShiftLeft", "AltLeft"],
      ["ShiftRight", "AltRight"]
    );
    document.addEventListener("keydown", this.highlightButton.bind(this));
    document.addEventListener("keyup", this.removeHighlightButton.bind(this));
    document.addEventListener("mouseup", this.fixSticking.bind(this));
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyRow = document.createElement("div");
    keyRow.classList.add("keyRow");
    for (const button of arrayButtons) {
      const { text, wide, altText, br, type, code } = button;
      const newButton = createButton(text, this.lang, altText, type, code);
      newButton.init();

      this.keys.push(newButton);
      keyRow.append(newButton.node);
      if (br) {
        fragment.append(keyRow);
        keyRow = document.createElement("div");
        keyRow.classList.add("keyRow");
      }
    }
    return fragment;
  }

  clickButton(event) {
    if (event.target.dataset.button) {
      switch (event.target.dataset.button) {
        case "Backspace":
          this.backspaceHandler();
          break;
        case "Tab":
          this.tabHandler();
          break;
        case "DEL":
          this.delHandler();
          break;
        case "Caps Lock":
          this.capsHandler(event);
          break;
        case "ENTER":
          this.enterHandler();
          break;
        case "Shift":
          this.shiftHandler(event);
          break;
        case "&#8593;":
          this.arrowUpHandler();
          break;
        case "Ctrl":
          this.ctrlHandler();
          break;
        case "Win":
          this.winHandler();
          break;
        case "Alt":
          this.altHandler();
          break;
        case "&#8592;":
          this.arrowLeftHandler();
          break;
        case "&#8595;":
          this.arrowDownHandler();
          break;
        case "&#8594;":
          this.arrowRightHandler();
          break;
        default:
          this.printText(event);
      }
    }
  }

  backspaceHandler() {
    const {
      value: val,
      selectionStart: start,
      selectionEnd: end,
    } = this.textArea;
    if (start !== end) {
      this.textArea.value = `${val.slice(0, start)}${val.slice(end)}`;
      this.setPositionCursor(start);
    } else if (start !== 0) {
      this.textArea.value = `${val.slice(0, start - 1)}${val.slice(start)}`;
      this.setPositionCursor(start - 1);
    } else {
      this.setPositionCursor(start);
    }
  }

  tabHandler() {
    const {
      value: val,
      selectionStart: start,
      selectionEnd: end,
    } = this.textArea;
    this.textArea.value = `${val.substring(0, start)}\t${val.substring(end)}`;
    this.setPositionCursor(start + 1);
  }

  delHandler() {
    const {
      value: val,
      selectionStart: start,
      selectionEnd: end,
    } = this.textArea;
    if (start !== end) {
      this.textArea.value = `${val.slice(0, start)}${val.slice(end)}`;
    } else if (end !== val.length) {
      this.textArea.value = `${val.slice(0, start)}${val.slice(start + 1)}`;
    }
    this.setPositionCursor(start);
  }

  capsHandler(e) {
    const { selectionStart: start } = this.textArea;
    this.capsLock = !this.capsLock;
    e.target.classList.toggle("active");
    for (const button of this.keys) {
      button.caps();
    }
    this.setPositionCursor(start);
  }

  enterHandler() {
    const {
      value: val,
      selectionStart: start,
      selectionEnd: end,
    } = this.textArea;
    this.textArea.value = `${val.substring(0, start)}\n${val.substring(end)}`;
    this.setPositionCursor(start + 1);
  }

  shiftHandler(e) {
    const { selectionStart: start } = this.textArea;
    if (!e.isTrusted) {
      e.target.classList.toggle("active");
      this.setShiftedButtons();
    }
    this.setPositionCursor(start);
  }

  shiftMouseDownHandler(e) {
    if (!this.mouseShift && isShift(e.target.textContent)) {
      this.mouseShift = true;
      this.nodeShift = e.target;
      this.shiftMouseHandler();
    }
  }

  shiftMouseUpHandler(e) {
    if (this.mouseShift && isShift(e.target.textContent)) {
      this.mouseShift = false;
      this.shiftMouseHandler();
    }
  }

  shiftMouseHandler() {
    const { selectionStart: start } = this.textArea;
    this.nodeShift.classList.toggle("active");
    this.setShiftedButtons();
    this.setPositionCursor(start);
  }

  setShiftedButtons() {
    this.shift = !this.shift;
    for (const button of this.keys) {
      button.shift();
    }
  }

  arrowUpHandler() {
    this.setPositionCursor(0);
  }

  ctrlHandler() {
    const { selectionStart: start } = this.textArea;
    if (this.shift) this.changeLang();
    this.setPositionCursor(start);
  }

  winHandler() {
    const { selectionStart: start } = this.textArea;
    this.setPositionCursor(start);
  }

  altHandler() {
    const { selectionStart: start } = this.textArea;
    this.setPositionCursor(start);
  }

  arrowLeftHandler() {
    const { selectionStart: start } = this.textArea;
    this.setPositionCursor(start - 1);
  }

  arrowDownHandler() {
    const { value: val } = this.textArea;
    this.setPositionCursor(val.length);
  }

  arrowRightHandler() {
    const { selectionStart: start } = this.textArea;
    this.setPositionCursor(start + 1);
  }

  printText(e) {
    const word = e.target.textContent;
    const {
      value: val,
      selectionStart: start,
      selectionEnd: end,
    } = this.textArea;
    if (this.capsLock && this.shift) {
      this.textArea.value = `${val.substring(
        0,
        start
      )}${word.toLowerCase()}${val.substring(end)}`;
    } else if (this.capsLock || this.shift) {
      this.textArea.value = `${val.substring(
        0,
        start
      )}${word.toUpperCase()}${val.substring(end)}`;
    } else {
      this.textArea.value = `${val.substring(
        0,
        start
      )}${word.toLowerCase()}${val.substring(end)}`;
    }
    this.setPositionCursor(start + 1);
  }

  changeLang() {
    this.lang = this.lang === "en" ? "ru" : "en";
    localStorage.setItem("lang", this.lang);
    for (const button of this.keys) {
      button.changeLanguage(this.lang);
    }
  }

  setPositionCursor(position) {
    this.textArea.focus();
    this.textArea.selectionStart = position;
    this.textArea.selectionEnd = position;
  }

  highlightButton(e) {
    const button = this.keys.find((i) => i.code === e.code);
    if (button) {
      if (isArrow(button.code)) {
        button.node.classList.add("active");
      } else {
        e.preventDefault();

        if (isCaps(button.code) && e.repeat) return null;
        if (isShift(button.code) && e.repeat) return null;
        if (isCtrl(button.code) && e.repeat) return null;
        if (!isCaps(button.code) && !isShift(button.code)) {
          button.node.classList.add("active");
        }

        button.node.click();
      }
    }
    return null;
  }

  removeHighlightButton(e) {
    const button = this.keys.find((i) => i.code === e.code);
    if (button) {
      if (isArrow(button.code)) {
        button.node.classList.remove("active");
      } else {
        e.preventDefault();

        if (!isCaps(button.code) && !isShift(button.code)) {
          button.node.classList.remove("active");
        }

        if (isShift(button.code)) {
          button.node.click();
        }
      }
    }
    return null;
  }

  fixSticking(e) {
    if (!isShift(e.target.textContent) && this.mouseShift) {
      this.mouseShift = false;
      this.setShiftedButtons();
      const el = this.keys.find(
        (i) => i.node.classList.contains("active") && isShift(i.code)
      );
      el.node.classList.remove("active");
    }
  }
}

function createButton(text, lang, altText, type, code) {
  let button;
  switch (type) {
    case "alternative":
      button = new ButtonAlternative(text, lang, altText, code);
      break;
    case "functional":
      button = new Button(text, lang, altText, code);
      break;
    default:
      button = new ButtonWord(text, lang, altText, code);
      break;
  }
  return button;
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.init();
};

/*










let codes = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
    "Backspace",
  ],
  [
    "Tab",
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Backslash",
    "Delete",
  ],
  [
    "CapsLock",
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Enter",
  ],
  [
    "ShiftLeft",
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
    "ArrowUp",
    "ShiftRight",
  ],
  [
    "ControlLeft",
    "MetaLeft",
    "AltLeft",
    "Space",
    "AltRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
    "ControlRight",
  ],
];
let keyEn = [
  [
    "`",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
  ],
  [
    "Tab",
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "[",
    "]",
    "/ ",
    "Del",
  ],
  ["Caps Lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "⮝", "Shift"],
  ["Ctrl", "Win", "Alt", "", "Alt", "⮜", "⮟", "⮞", "Ctrl"],
];

const localeRU = {
  q: "й",
  w: "ц",
  e: "у",
  r: "к",
  t: "е",
  y: "н",
  u: "г",
  i: "",
  o: "",
  p: "",
  "[": "х",
  "]": "ъ",
  a: "ф",
  s: "ы",
  d: "в",
  f: "а",
  g: "п",
  h: "р",
  j: "о",
  k: "л",
  l: "д",
  ";": "ж",
  "'": "э",
  z: "я",
  x: "ч",
  c: "с",
  v: "м",
  b: "и",
  n: "т",
  m: "ь",
  ",": "б",
  ".": "ю",
  "/": ".",
};
const localeEN = {};
let currentLocale = localeRU;
function getForLocale(symbol, localeDict) {
  return localeDict[symbol] || symbol;
}

const main = document.createElement("main");
const h1 = document.createElement("h1");
const p = document.createElement("p");

h1.innerHTML = "Virtual Keyboard";
p.innerText = "OS: Window. Change Language: Cntrl + Shift ";
main.append(h1);
main.append(p);
//textarea
const textarea = document.createElement("textarea");
const form = document.createElement("form");

textarea.id = "text-content";
form.append(textarea);
main.append(form);
//lang
const ChangeLang = () => {
  const cashLanguage = localStorage.getItem("currentLocal");
  if (currentLocale == localeRU) {
  }
};

//keyboard
const keyboard = document.createElement("div");

keyboard.classList.add("keyboard");
keyboard.Id = "keyboard";

for (let i = 0; i < keyEn.length; i++) {
  const keyRow = document.createElement("div");
  for (let j = 0; j < keyEn[i].length; j++) {
    const keyBtn = document.createElement("button");

    keyBtn.innerText = getForLocale(keyEn[i][j], currentLocale);

    keyBtn.classList.add("key");
    keyBtn.classList.add(codes[i][j]);
    keyRow.append(keyBtn);
  }
  keyRow.classList.add("keyRow");
  keyboard.append(keyRow);
}

main.append(keyboard);
document.body.append(main);

document.addEventListener("click", (event) => {
  if (event.target.tagName == "BUTTON") {
    if (
      event.target.ClassName == "ShiftLeft" &&
      event.target.ClassName == "ShiftRight"
    ) {
    } else {
      let symbol = event.target.innerText;
      let textarea = document.getElementById("text-content");
      let oldValue = textarea.value;
      let newValue = oldValue + symbol;
      textarea.value = newValue;
    }
  }
});
*/
