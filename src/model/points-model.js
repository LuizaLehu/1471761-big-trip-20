//import { POINT_COUNT } from '../const.js';
import Observable from '../framework/observable.js';
//import { getRandomPoint } from '../mock/point.js';

export default class PointsModel extends Observable {
  //#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
  #points = [];
  //#offersModel = null;
  //#destinationsModel = null;
  #service = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.getPoints();
  }

  get() {
    return this.#points;
  }

  getById(id) {
    return this.#points
      .find((point) => point.id === id);
  }

  update(updateType, update) {
    this.#points = this.#service.updatePoints(update);
    this._notify(updateType, update);
  }

  add(updateType, point) {
    this.#points = this.#service.addPoints(point);
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    this.#points = this.#service.deletePoints(point);
    this._notify(updateType, point);
  }
}
