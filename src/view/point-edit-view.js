import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {EditingType, EMPTY_POINT, TYPES} from '../const.js';
import {formatDateTime} from '../utils/point.js';


import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const DATETIME_FORMAT = 'd/m/Y HH:mm';

function createEventTypesListTemplate(currentType) {
  const typesList = Object.values(TYPES).map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`,
  ).join('');
  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesList}
            </fieldset>
          </div>`;
}

function createTypeOffersListTemplate(typeOffers) {
  if (typeOffers.length === 0) {
    return '';
  }
  const offersList = typeOffers.map(({id, title, price, checked}) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"${checked ? ' checked' : ''}>
      <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>`;
}

function createEventDescriptionTemplate(destination) {
  const {description, pictures} = destination;
  if (!description && (!pictures || pictures.length === 0)) {
    return '';
  }
  const picturesContainer = pictures.length > 0 ? `<div class="event__photos-container">
                                          <div class="event__photos-tape">
                                            ${pictures.map(({
    src,
    description: picDescription,
  }) => `<img class="event__photo" src="${src}" alt="${picDescription}">`).join('')}
                                          </div>
                                        </div>` : '';
  const descriptionContainer = description ? `<p class="event__destination-description">${description}</p>` : '';
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${descriptionContainer}
            ${picturesContainer}
          </section>`;
}

function createEventDetailsTemplate(offers, destination) {
  if (!destination) {
    return '';
  }
  return `<section class="event__details">
          ${createTypeOffersListTemplate(offers)}
          ${createEventDescriptionTemplate(destination)}
          </section>`;
}

/*
function renderDestinationOptionsTemplate (cities) {
  if (!cities.length) {
    return '';
  }
  return cities.map((city) => `<option value=${city.name}></option>`).join('');
}

function createDestinationTemplate (destinations, initialDestination, isDisabled) {

  const destinationName = initialDestination !== null ? initialDestination.name : '';

  return `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1">
          <datalist id="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${renderDestinationOptionsTemplate(destinations)}
          </datalist>`;
}

*/

function createEditorTemplate(data) {
  const isEmptyPoint = !data.state.point.id;
  const eventPoint = isEmptyPoint ? EMPTY_POINT : data.state.point;
  // console.log('createEditorTemplate', eventPoint, isEmptyPoint);
  const {basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving} = eventPoint;

  // offers = this.data.pointOffers[0].offers;

  const name = destination ? destination.name : '';
  const eventStartDate = formatDateTime(dateFrom, DATETIME_FORMAT);
  const eventEndDate = formatDateTime(dateTo, DATETIME_FORMAT);
  const cities = data.pointDestinations.map((dest) => dest.name);

  function renderCityOptions() {
    return cities.map((city) => `<option value="${city}"></option>`);
  }

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${createEventTypesListTemplate(type)}
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
               ${renderCityOptions(cities)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndDate}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''} >
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset">
            ${isDisabled ? 'disabled' : ''}${isEmptyPoint ? 'Cancel' : 'Delete'}
        </button>
        <button class="event__rollup-btn" type="button"  ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>
        </header >
    ${createEventDetailsTemplate(offers, destination)}
      </form >
    </li > `
  );
}

export default class PointEditView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;
  #type;

  constructor({
    point = EMPTY_POINT,
    pointDestinations,
    pointOffers,
    onSubmitClick,
    onResetClick,
    onDeleteClick,
    type = EditingType.EDITING,
  }) {
    super();

    this._setState(PointEditView.parsePointToState({point, pointDestinations, pointOffers}));

    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    this.#onResetClick = onResetClick;
    this.#handleFormSubmit = onSubmitClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#type = type;

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
      type: this.#type,
    });
  }


  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  //de verificat aici
  reset = (point) => this.updateElement({point});

  _restoreHandlers = () => {

    if (this.#type === EditingType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetButtonClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#handleDeleteClick);
    }

    if (this.#type === EditingType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetButtonClickHandler);
    }

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((element) => {
        element.addEventListener('change', this.#typeInputClick);
      });

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#pointDeleteClickHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);

    this.#setDatepickers();
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state.point));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [], // ToDo заполнить офферы
      },
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((pointDestinations) => pointDestinations.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    // this._state.point.destination = selectedDestinationId;

    this._setState({
      point: {
        ...this._state.point,
        destination: selectedDestinationId,
      },
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId),
      },
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber,
      },
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      },
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      },
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers = () => {

    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.point.dateTo,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.point.dateFrom,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true,
      },
    );
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));

  };

  static parsePointToState = (point) => {
    const state = {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };

    return state;
  };

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

}
