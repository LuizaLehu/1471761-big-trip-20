import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';
import { TripDuration } from './const.js';

let date = dayjs().subtract(getRandomInteger(0, TripDuration.DAY), 'day').toDate;

function getDate({ next }) {
  const minsGap = getRandomInteger(0, TripDuration.MIN);
  const hoursGap = getRandomInteger(1, TripDuration.HOUR);
  const daysGap = getRandomInteger(0, TripDuration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }
  return date;
}

export { getDate };
