export default class DestinationModel {
  constructor(service) {
    this.service = service;
    this.destinations = this.service.getDestinations();
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations
      .find((destination) => destination.id === id);
  }
}
