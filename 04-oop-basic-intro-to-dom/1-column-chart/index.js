export default class ColumnChart {

  constructor(object = {}) {
    this.data = object.data;
    this.label = object.label;
    this.link = object.link;
    this.value = object.value;
    this.chartHeight = 50;
    this.render();
  }

  update = (newData) => {
    this.data = newData;
    const columnChartChart = this.element.querySelector('.column-chart__chart');
    columnChartChart.innerHTML = this.createColumnChart();
  }

  createColumnChart = () => {

    if (!this.data || this.data.length === 0) return `<img src="./charts-skeleton.svg">`

    const maxDataValue = Math.max(...this.data);

    return this.data.reduce((prev, cur) => { //TODO Вынести вычисления в отдельный метод?
      return prev +
        `<div
            style="--value: ${Math.floor(cur * 50 / maxDataValue)}" 
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
