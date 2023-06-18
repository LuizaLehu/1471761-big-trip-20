
import { getRandomInteger } from '../utils/common.js';
import { Price } from './const.js';
import { nanoid } from 'nanoid';

function generateOffer(type) {
  return {
    id: nanoid(),
    title: ` Offer ${type}`,
    price: getRandomInteger(Price.MIN, (Price.MAX / 10))
  };
}

export { generateOffer };

