import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

// https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory
// https://course-js.javascript.ru/api/rest/products?id=101-planset-lenovo-tab-p10-tb-x705l-32-gb-3g-lte-belyj
// send form https://course-js.javascript.ru/api/rest/products

export default class ProductForm {

  constructor(productId) {

    if (productId) {
      this.productId = productId;
      this.mode = 'edit';
    } else {
      this.mode = 'create';
    }

    this.reqParams = {
      _sort: 'weight',
      _refs: 'subcategory'
    }

    this.getListCategory();
    this.getProductDetails(this.productId);
  }

  createUrl(api) {
    const url = new URL(api, BACKEND_URL);

    for (let key of Object.keys(this.reqParams)) {
      const value = this.reqParams[key];
      url.searchParams.set(key, value)
    }

    return url;
  }

  async getListCategory() {
    const url = '/api/rest/categories';

    this.reqParams = ({
      _sort: 'weight',
      _refs: 'subcategory'
    })

    const response = await fetchJson(this.createUrl(url))
    this.updateCategories(response);
  }

  async getProductDetails(id) {
    const url = '/api/rest/products';

    this.reqParams = ({
      id: id
    })

    const response = await fetchJson(this.createUrl(url));
    this.updateProductDetails(response); // Обновляем данные на форме
    this.sendProductForm(); // FIXME Навешиваем на кнопку обработчик
  }

  updateCategories(categories) { // FIXME Сделать правильно отображение
    const result = categories.map(({ id, title, subcategories }) => {
      return `<option value="${id}"> ${title} > ${subcategories.map(({ title }) => title).join('')}</option>`
    }).join('');

    this.subElements.subcategory.innerHTML = result;
  }

  updateProductDetails([{ id, title, description, price, discount, quantity, status }]) {
    this.subElements['product-name'].value = title;
    this.subElements['product-description'].value = description;
    this.subElements['product-price'].value = price;
    this.subElements['product-discount'].value = discount;
    this.subElements['product-quantity'].value = quantity;
    this.subElements['product-status'].value = status; //TODO Тут подумать!
  }

  async sendProductForm() {
    const productForm = this.subElements['productForm'];
    const productFormData = new FormData(productForm);

    productForm.onsubmit = async (e) => { // Обработчик навесили
      e.preventDefault();

      const response = await fetchJson('https://course-js.javascript.ru/api/rest/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: productFormData
      });

      let result = await response.json();
      console.log(result);
    }
  }

  getTemplate() {
    return `
            <div class="product-form">
            <form data-element="productForm" class="form-grid">
              <div class="form-group form-group__half_left">
                <fieldset>
                  <label class="form-label">Название товара</label>
                  <input data-element="product-name" required="" type="text" name="title" class="form-control" placeholder="Название товара">
                </fieldset>
              </div>
              <div class="form-group form-group__wide">
                <label class="form-label">Описание</label>
                <textarea data-element="product-description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
              </div>
              <div class="form-group form-group__wide" data-element="sortable-list-container">
                <label class="form-label">Фото</label>
                <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
                  <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
                  <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
                  <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
                <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
              </span>
                  <button type="button">
                    <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                  </button></li></ul></div>
                <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
              </div>
              <div class="form-group form-group__half_left">
                <label class="form-label">Категория</label>
                <select data-element="subcategory" class="form-control" name="subcategory">
                  <option value="ochki-virtualnoy-realnosti">ТВ и видеотехника &gt; Очки виртуальной реальности</option>
                  <option value="proektsionnoe-oborudovanie">ТВ и видеотехника &gt; Проекционное оборудование</option>
                  <option value="videokamery-i-aksessuary">ТВ и видеотехника &gt; Видеокамеры и аксессуары</option>
                  <option value="dvd/blu-ray-pleery">ТВ и видеотехника &gt; DVD/Blu-ray плееры</option>
                </select>
              </div>
              <div class="form-group form-group__half_left form-group__two-col">
                <fieldset>
                  <label class="form-label">Цена ($)</label>
                  <input data-element="product-price" required="" type="number" name="price" class="form-control" placeholder="100">
                </fieldset>
                <fieldset>
                  <label class="form-label">Скидка ($)</label>
                  <input data-element="product-discount" required="" type="number" name="discount" class="form-control" placeholder="0">
                </fieldset>
              </div>
              <div class="form-group form-group__part-half">
                <label class="form-label">Количество</label>
                <input data-element="product-quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
              </div>
              <div class="form-group form-group__part-half">
                <label class="form-label">Статус</label>
                <select data-element="product-status" class="form-control" name="status">
                  <option value="1">Активен</option>
                  <option value="0">Неактивен</option>
                </select>
              </div>
              <div class="form-buttons">
                <button type="submit" name="save" class="button-primary-outline">
                  Сохранить товар
                </button>
              </div>
            </form>
           `
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (let sub of elements) {
      const name = sub.dataset.element;
      result[name] = sub;
    }

    return result;
  }
}
