import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';

import { render, remove, replace, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/board-view.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sort } from '../utils/sort.js';


export default class BoardPresenter {

  #container = null;

  #sortComponent = null;
  #eventListComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];
  #currentSortType = SortType.DAY;


  #noPointComponent = new EmptyListView();

  #pointPresenters = new Map();

  constructor({ container, destinationsModel, offersModel, pointsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = sort[SortType.DAY]([...this.#pointsModel.get()]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onChangeData: this.#pointChangeHandler,
      onChangeMode: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };


  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderSort = (container) => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {

      render(this.#sortComponent, container, RenderPosition.AFTERBEGIN);
    }
  };

  #renderPointContainer = () => {
    this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#container);
  };

  #renderBoard = () => {

    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderSort(this.#container);
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

