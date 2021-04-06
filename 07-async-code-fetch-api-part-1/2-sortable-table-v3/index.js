import fetchJson from './utils/fetch-json.js';
import compareViaIntlCollarator from '../../02-javascript-data-types/1-sort-strings/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  constructor(
    header = [],
  ) {
    this.header = header;
    this.isLoaded = true;
    this.data = [];

    (async () => { // async function
      await this.fetchData();
      await this.render();
    })()

  }

  async fetchData() {
    let response;
    
    try {
      response = await fetch('https://course-js.javascript.ru/api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30');
    } catch (error) {
      throw new Error('Something go wrong with error : ' + error);
    }

    if (response.ok) { //FIXME Проверить 404 - тоже ок?
      const json = await response.json();
      this.data = this.data.concat(json);
      this.loaded = true;
      return this.data;
    }
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

  getSortArrow(sortable) {
    return sortable ?
      `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      `
      :
      ''
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

  async render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.template;
    this.element = tempWrapper.firstElementChild;

    this.sortableTableBody = this.element.querySelector('[data-element="body"]'); //Одного data-elemeta достаточно
    this.headerElements = this.element.querySelectorAll('.sortable-table__header .sortable-table__cell'); //FIXME Улучшить?
    this.onClickTableHeaderDataSort();
    this.onScrollDownGetMoreData();
  }

  sort(sortField, direction) {
    const sortedData = this.sortDataByParam(this.data, sortField, direction); // sort data
    const updatedTableBody = this.getSortableTableBody(sortedData);
    this.sortableTableBody.innerHTML = updatedTableBody;
  }

  // Event Listeners
  onClickTableHeaderDataSort() {
    this.headerElements.forEach(element => {
      const { sortable } = element.dataset;
      if (sortable) {
        element.addEventListener('click', () => {
          const { id, order } = element.dataset;
          this.sort(id, order);
          changeSortDirection(element, order);
        })
      }
    })

    // local function
    function changeSortDirection(element, order) {
      element.dataset.order = (order === 'asc' ? 'desc' : (order === 'desc' ? 'asc' : ''))
    }
  }

  onScrollDownGetMoreData() {
    window.addEventListener('scroll', () => {
      if (document.body.offsetHeight < 3/2 * (window.innerHeight + window.scrollY) && this.loaded) {
        this.loaded = false; // Пока данные не загрузятся, событие новой подгрузки не будет
        this.fetchData();
      }
    })
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
      compareResult = compareViaIntlCollarator(fieldA, fieldB, ['ru', 'en'], direction); // imported function
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
}

