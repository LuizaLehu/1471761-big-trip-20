import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES, EMPTY_POINT } from '../const.js';
import { formatDateTime } from '../utils/point.js';

const DATETIME_FORMAT = 'DD/MM/YY HH:mm';

function createEventTypesListTemplate(currentType) {
  const typesList = Object.values(TYPES).map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`
  ).join('');

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesList};
            </fieldset>
          </div>`;
}

function createTypeOffersListTemplate(typeOffers) {
  if (typeOffers.length === 0) {
    return '';
  }

  const offersList = typeOffers.map(({ id, title, price, checked }) =>
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
  const { description, pictures } = destination;
  if (!description && (!pictures || pictures.length === 0)) {
    return '';
  }

  const picturesContainer = pictures.length > 0 ? `<div class="event__photos-container">
                                          <div class="event__photos-tape">
                                            ${pictures.map(({ src, description: picDescription }) => `<img class="event__photo" src="${src}" alt="${picDescription}">`).join('')}
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

function createEditorTemplate(data) {

  const isNewEventPoint = !data.id;
  const eventPoint = isNewEventPoint ? EMPTY_POINT : data;

  const { basePrice, dateFrom, dateTo, destination, offers, type } = eventPoint;

  const name = destination ? destination.name : '';

  const eventStartDate = formatDateTime(dateFrom, DATETIME_FORMAT);
  const eventEndDate = formatDateTime(dateTo, DATETIME_FORMAT);

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
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNewEventPoint ? 'Cancel' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createEventDetailsTemplate(offers, destination)}
      </form>
    </li>`
  );
}


export default class PointEditView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;

  #onResetClick = null;
  #onSubmitClick = null;

  constructor({ point = EMPTY_POINT, pointDestinations, pointOffers, onSubmitClick, onResetClick }) {
    super();

    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;


    this._setState(PointEditView.parsePointToState({ point, pointDestinations }));

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
    });
  }

  reset = (point) => this.updateElement({ point });

  _restoreHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetButtonClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((element) => {
        element.addEventListener('change', this.#typeInputClick);
      });

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((pointDestinations) => pointDestinations.name === evt.target);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber
      }
    });
  };


  static parsePointToState = ({ point }) => ({ point });

  static parseStateToPoint = (state) => state.point;

}

