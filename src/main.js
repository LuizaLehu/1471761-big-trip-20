import { render, RenderPosition } from './framework/render.js';

import BoardPresenter from './presenter/board-presenter.js';

import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';

import MockService from './service/mock-service.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

import { generateFilters } from './mock/filter.js';

const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');

const mockService = new MockService();
const destinationsModel = new DestinationModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);


const boardPresenter = new BoardPresenter({
  container: mainElement,
  destinationsModel,
  offersModel,
  pointsModel
});


const filters = generateFilters(pointsModel.points);

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

render(new FilterView({ filters }), mainElement);


boardPresenter.init();
