import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButtonView extends AbstractView {
  #onNewPointButtonClick = null;

  constructor({ onNewPointButtonClick }) {
    super();
    this.#onNewPointButtonClick = onNewPointButtonClick;
    this.element.addEventListener('click', this.#onNewPointButtonClick);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #onNewEventClick = (evt) => {
    evt.preventDefault();
    this.#onNewPointButtonClick();
  };

}
