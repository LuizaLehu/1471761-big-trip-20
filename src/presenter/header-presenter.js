import TripInfoView from '../view/trip-info-view';
import NewEventButtonView from '../view/new-event-button-view.js';
import { render } from '../framework/render';


export default class HeaderPresenter {
  #headerContainer = null;
  #events = [];

  #title = null;
  #dates = null;
  #price = null;

  constructor(headerContainer, title, dates, price, events) {

    this.#headerContainer = headerContainer;
    this.#title = title;
    this.#dates = dates;
    this.#price = price;
    this.#events = events;
  }

  init() {
    this.#renderTripInfo();
    this.#renderNewEventButton();
  }

  #renderTripInfo() {
    render(new TripInfoView({
      title: this.#title,
      dates: this.#dates,
      price: this.#price,
    }), this.#headerContainer);
  }

  #renderNewEventButton() {
    const newEventButtonComponent = new NewEventButtonView();

    render(newEventButtonComponent, this.#headerContainer);
  }

}
