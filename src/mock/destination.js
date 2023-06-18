import { getRandomValue } from '../utils/common.js';
import { CITIES, DESCRIPTION } from './const.js';
import { nanoid } from 'nanoid';

function generateDestination() {
  const city = getRandomValue(CITIES);
  const id = nanoid();
  return {
    id: id,
    name: city,
    description: DESCRIPTION,
    pictures: [
      {
        'src': ` https://loremflickr.com/300/200?random=${id}`,
        'description': `${city} description`
      }
    ]
  };
}

export { generateDestination };

