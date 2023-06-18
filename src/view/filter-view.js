import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/point.js';


function createFilterItemTemplate(filter, currentFilterType) {
  const { type, count } = filter;

  return `
        <input
         id="filter-${type}"
         class="trip-filters__filter-input  visually-hidden"
         type="radio"
         name="trip-filter"
         ${type === currentFilterType ? 'checked' : ''}
         ${count === 0 ? 'disabled' : ''}
         value="${type}"
          />
        <label
        class="trip-filters__filter-label"
        for="filter-${type}"
        >
        ${capitalize(type)}
        </label>
      </div>
      `;
}

function createFilterTemplate(filterItems, currentFilterType) {

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<div class="trip-filters__filter">
      ${filterItemsTemplate}
    </div>`
  );
}
export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;


  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}
