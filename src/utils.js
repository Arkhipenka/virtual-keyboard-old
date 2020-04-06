function isCaps(code) {
  return code === 'CapsLock';
}

function isShift(code) {
  return ['Shift', 'ShiftLeft', 'ShiftRight'].includes(code);
}

function isCtrl(code) {
  return ['ControlLeft', 'ControlRight'].includes(code);
}

function isArrow(code) {
  return ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(code);
}

function runOnKeys(func, ...combinations) {
  const pressed = new Set();

  document.addEventListener('keydown', (event) => {
    pressed.add(event.code);

    for (const combination of combinations) {
      if (pressed.has(combination[0]) && pressed.has(combination[1])) {
        pressed.clear();
        func(event);
      }
    }
  });

  document.addEventListener('keyup', (event) => {
    pressed.delete(event.code);
  });
}

export { isCaps, isShift, runOnKeys, isArrow, isCtrl };
