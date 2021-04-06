// import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {

    constructor(object = {}) {
        this.url = object.url;
        this.range = object.range;
        this.label = object.label;
        this.link = object.link;
        this.data = [];
        this.chartHeight = 50;
        this.render();
        this.update(this.range.from, this.range.to);
    }

    createUrlWithQueryParams() {
        const url = new URL('https://course-js.javascript.ru/api/dashboard/orders');
        url.search = new URLSearchParams(this.range).toString();

        return url;
    }

    async fetchData() {
        let response;

        try {
            response = await fetch(this.createUrlWithQueryParams(), { method: 'GET' });
        } catch (error) {
            throw new Error('Something go wrong with error : ' + error);
        }
        if (response.ok) {
            const json = await response.json();
            return Object.values(json);
        }
    }

    update(beginDate, endDate) {
        this.setUpdatedRange(beginDate, endDate);

        this.fetchData().then(data => {
            this.data = data;
        }).then(
            () => {
                this.calculateTotalValue();
                const columnChartChart = this.element.querySelector('.column-chart__chart');
                columnChartChart.innerHTML = this.createColumnChart();
            }
        )
    }

    setUpdatedRange(beginDate, endDate) {
        this.range = {
            from: beginDate,
            to: endDate
        }
    }

    calculateTotalValue() { //TODO Сделать рендер для этой функции
        this.value = this.data.reduce((prev, cur) => {
            return prev + cur;
        }, 0)
    }

    createColumnChart() {
        if (!this.data || this.data.length === 0) return `<img src="./charts-skeleton.svg">`
        
        const maxDataValue = Math.max(...this.data);

        return this.data.reduce((prev, cur) => { //TODO Вынести вычисления в отдельный метод?
            return prev +
                `<div
              style="--value: ${Math.floor(cur * this.chartHeight / maxDataValue)}" 
              data-tooltip="${(cur / maxDataValue * 100).toFixed(0)}%"
         ></div>`
        }, ``)
    }


    render() {
        const element = document.createElement('div');

        element.innerHTML = `
          <div class="column-chart ${!this.data || this.data.length === 0 ? 'column-chart_loading' : ''} " style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
              Total ${this.label}
              ${this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : ``}
            </div>
            <div class="column-chart__container">
              <div data-element="header" class="column-chart__header">${this.value}</div>
              <div data-element="body" class="column-chart__chart">
                ${this.createColumnChart()}
              </div>
            </div>
          </div>
          `

        this.element = element.firstElementChild;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}

