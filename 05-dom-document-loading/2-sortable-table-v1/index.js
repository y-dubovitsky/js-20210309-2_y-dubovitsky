export default class SortableTable {

  constructor(
    header = [],
    { data } = [],
  ) {
    this.header = header;
    this.data = data;
    this.render();
  }

  // Header
  getTableHeader(header) {
    return `
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${header.map(item => getHeaderCell(item)).join('')}
          </div>
            `

    function getHeaderCell({ id, title, sortable }) {
      return `
            <div class="sortable-table__cell" data-id="${id}" data-name="${title}" data-sortable="${sortable}">
            <span>${title}</span>
            ${sortable ?
          `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>`
          : ''
        }
            </div>
            `
    }
  }

  // TableBody
  getTableBody(data, header = this.header) {
    return  `
              ${data.map(element => getTableRow(element, header)).join('')}
            `

    function getTableRow(element, header) {
      return `
            <a href="/products/${element.id}" class="sortable-table__row">
              ${header.map(head => {
                return head.template ? head.template(element.images) //FIXME ПЛОХО! element.images! 
                :
                `<div class="sortable-table__cell">${element[head.id]}</div>`
              }).join('')}
            </a>
            `
    }
  }

  // Template
  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        ${this.getTableHeader(this.header)}
        <div data-element="body" class="sortable-table__body">
          ${this.getTableBody(this.data, this.header)}
        </div>
      </div>
    </div>
    `
  }

  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.getTemplate();
    this.element = tempWrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  // Get all data-elements from DOM element
  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sort(sortField, direction) {
    const sortedData = this.sortDataByParam(this.data, sortField, direction); // sort data

    const updatedTableBody = this.getTableBody(sortedData);
    this.sortableTableBody = this.subElements['body'];
    this.sortableTableBody.innerHTML = updatedTableBody;
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
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
      compareResult = compareString(fieldA, fieldB, ['ru', 'en'], direction);
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

    function compareString(a, b, locales, direction) {
      return direction * a.localeCompare(b, [...locales], { sensitivity: 'variant', caseFirst: 'upper' });
    }
  }
}
