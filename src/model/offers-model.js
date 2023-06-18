export default class OffersModel {
  constructor(service) {
    this.service = service;
    this.offers = this.service.getOffers();
  }

  get() {
    return this.offers;
  }

  getByType(type) {
    return this.offers
      .find((offer) => offer.type === type).offers;
  }
}
