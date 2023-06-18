import AbstractView from '../framework/view/abstract-view.js';

const createErrorTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class ErrorMessageView extends AbstractView {
  #message = null;
  constructor({ message }) {
    super();
    this.#message = message;
  }

  get template() {
    return createErrorTemplate(this.#message);
  }
}
