import { SortType } from '../const.js';
import { getPointsDateDifference, getPointsDurationsDifference, getPointsPriceDifference } from './point.js';

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

export { sort };
