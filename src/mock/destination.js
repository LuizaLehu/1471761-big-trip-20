import { getRandomValue } from '../utils/common.js';
import { CITIES, DESCRIPTION } from './const.js';

function generateDestination() {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTION,
    pictures: [
      {
        'src': ` https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
        'description': `${city} description`
      }
    ]
  };
}

export { generateDestination };
