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

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}


export {
  updateItem,
  getRandomArrayElement,
  getRandomInteger,
  getRandomValue,
  isEscapeKey
};
