import { render, RenderPosition } from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';

import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

//const bodyElement = document.querySelector('body');
const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
//const eventListElement = mainElement.querySelector('trip-events');
//const mainFilterElement = tripInfoElement.querySelector('.trip-controls');

const mockService = new MockService();
const destinationsModel = new DestinationModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: mainElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  pointsModel,
  filterModel
});

const newPointButtonComponent = new NewEventButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(newPointButtonComponent, tripInfoElement);

filterPresenter.init();
boardPresenter.init();
