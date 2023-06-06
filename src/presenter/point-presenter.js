import WaypointView from '../view/waypoint-view.js';
import PointEditView from '../view/point-edit-view.js';

import { remove, render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import { Mode } from '../const.js';

export default class PointPresenter {
  #container = null;

  #onChangeData = null;
  #onChangeMode = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({container, destinationsModel, offersModel, onChangeData, onChangeMode }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onChangeData = onChangeData;
    this.#onChangeMode = onChangeMode;

  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new WaypointView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onResetClick: this.#resetButtonClickHandler,
      //onSubmitClick: this.#handleFormSubmit,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyHandler);
    this.#onChangeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyHandler = (evt) => {
    if (isEscapeKey) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#onChangeData({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #resetButtonClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #handlerFormSubmit = (point) => {
    this.#onChangeData(point);
    this.#replaceFormToPoint();
  };

}
