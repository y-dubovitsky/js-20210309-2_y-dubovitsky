export default class SortableTable {

  constructor(
    header = [],
    { data } = [],
  ) {
    this.header = header;
    this.data = data;
    this.render();
  }

  getSortArrow(sortable) {
    if (sortable) {
      return `
              <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>
            `
    }
    return ''
  }

  getSortableHeader() { // this.header - вынести в сигнатуру метода?
    const result = this.header.map(({ id, title, sortable, template, sortType }) => {
      return `
              <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-sort-type="${sortType}" data-order="asc">
                <span>${title}</span>
                ${this.getSortArrow(sortable)}
              </div>
              `
    }).join('');

    return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
              ${result}
            </div>
          `
  }

  getSortableTableBody(sortField = 'title', orderValue = 'asc') { //this.data - вынести в сигнатуру метода?
    const result = this.sortDataByParam(this.data, sortField, orderValue) // title - by default
      .map(({ id, title, description, quantity, subcategory, status, images, price, discount, sales }) => {
        return `
            <a href="${images?.[0]?.url}" class="sortable-table__row">
              <div class="sortable-table__cell">
                <img class="sortable-table-image" alt="Image" src="${images?.[0]?.url}">
              </div>
              <div class="sortable-table__cell">${title}</div>

              <div class="sortable-table__cell">${quantity}</div>
              <div class="sortable-table__cell">${price}</div>
              <div class="sortable-table__cell">${sales}</div>
            </a>
            `
      }).join('');

    return result;
  }

  get template() {
    return `
        <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
      
          ${this.getSortableHeader()}
      
          <div data-element="body" class="sortable-table__body">
            ${this.getSortableTableBody()}
          </div>
      
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
      
        </div>
      </div>
        `
  }

  sortDataByParam(arrOfObjects, sortField, orderValue) {

    function compareObjects(a, b, sortField, orderValue) {
      const direction = orderValue === 'asc' ? 1 : -1;
      const comparedFieldA = a[sortField];
      const comparedFieldB = b[sortField];

      let comparison = 0;

      if (comparedFieldA > comparedFieldB) {
        comparison = 1;
      } else if (comparedFieldA < comparedFieldB) {
        comparison = -1;
      }
      return comparison * direction;
    }

    return arrOfObjects.sort((a, b) => compareObjects(a, b, sortField, orderValue));
  }

  sort(sortField, orderValue) {
    const updatedTableBody = this.getSortableTableBody(sortField, orderValue);
    this.sortableTableBody.innerHTML = updatedTableBody;
  }

  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.template;
    this.element = tempWrapper.firstElementChild;

    this.sortableTableBody = this.element.querySelector('[data-element="body"]'); //TODO  Вынести data-elemetns
  }


}

