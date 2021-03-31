export default class SortableTable {

  constructor(
    header = [],
    { data } = [],
    compareViaIntlCollarator = {}
  ) {
    this.header = header;
    this.data = data;
    this.compareViaIntlCollarator = compareViaIntlCollarator;
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

  getSortableHeader(header = []) {
    const result = header.map(({ id, title, sortable, template, sortType }) => {
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

  getSortableTableBody(data = []) {
    const result = data.map(({ title, quantity, images, price, sales }) => {
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
          ${this.getSortableHeader(this.header)}
          <div data-element="body" class="sortable-table__body">
            ${this.getSortableTableBody(this.data)}
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

  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.template;
    this.element = tempWrapper.firstElementChild;

    this.sortableTableBody = this.element.querySelector('[data-element="body"]'); //Одного data-elemeta достаточно
  }

  sort(sortField, direction) {
    const sortedData = this.sortDataByParam(this.data, sortField, direction); // sort data

    const updatedTableBody = this.getSortableTableBody(sortedData);
    this.sortableTableBody.innerHTML = updatedTableBody;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  /**
   * Sorting array of objects
   * @returns sorted array of objects
   */
  sortDataByParam(arrOfObjects = [], sortField, sortDirection) {
    return arrOfObjects.sort((a, b) => this.compareObjects(a, b, sortField, sortDirection));
  }

  compareObjects(a, b, sortField, sortDirection) {
    let compareResult = 0;
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    const direction = sortDirection === 'asc' ? 1 : sortDirection === 'desc' ? -1 : '' //* Вычисляем коэффициент направления сортировки

    if (typeof fieldA === 'string') {
      compareResult = this.compareViaIntlCollarator(fieldA, fieldB, ['ru', 'en'], direction);
    }
    if (typeof fieldB === 'number') {
      compareResult = compareNumber(fieldA, fieldB, direction);
    }

    return compareResult;

    // local function
    function compareNumber(a, b, direction) {
      let result = 0;

      result = a > b ? direction * 1 : direction * -1;
      return result;
    }
  }

  /**
  * Return array of uniq fields in this.header
  */
  getHeaderUniqFields() {
    const uniqFields = [];

    this.header.forEach(object => {
      Object.keys(object).forEach(key => {
        !result.includes(key) ? result.push(key) : ''
      })
    })

    return uniqFields;
  }
}
