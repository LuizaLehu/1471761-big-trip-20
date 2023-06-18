function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function isEscapeKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}


export {
  getRandomArrayElement,
  getRandomInteger,
  getRandomValue,
  isEscapeKey
};
