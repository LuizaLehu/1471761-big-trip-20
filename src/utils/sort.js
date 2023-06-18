import { SortType } from '../const.js';
import { getPointsDateDifference, getPointsDurationsDifference, getPointsPriceDifference } from './point.js';
import { getDatesDiff } from './point.js';
import dayjs from 'dayjs';

if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (fn) {
    return [...this].sort(fn);
  };
}
const sort = {
  [SortType.DAY]: (points) => points.toSorted(getPointsDateDifference),
  [SortType.PRICE]: (points) => points.toSorted(getPointsPriceDifference),
  [SortType.TIME]: (points) => points.toSorted(getPointsDurationsDifference),
  [SortType.EVENT]: () => {
    throw new Error('Sort by $(SortType.EVENT) is not implemented');
  },
  [SortType.OFFERS]: () => {
    throw new Error('Sort by $(SortType.OFFER) is not implemented');
  }
};

const sortByDurationTime = (routePointA, routePointB) => getDatesDiff(routePointB.dateFrom, routePointB.dateTo) - getDatesDiff(routePointA.dateFrom, routePointA.dateTo);

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }
  if (dateA === null) {
    return 1;
  }
  if (dateB === null) {
    return -1;
  }
  return null;
}

function sortByDay(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  sort,
  sortByTime,
  sortByPrice,
  sortByDay,
  sortByDurationTime,
};
