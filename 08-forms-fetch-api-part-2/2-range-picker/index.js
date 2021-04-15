export default class RangePicker {
    constructor(
        {
            from,
            to
        } = {}
    ) {
        // input data
        this.from = from; 
        this.to = to;

        // class fields
        this.element;
        this.subElements;

        // invoked methods
        this.render();
    }

    // -------------------------- Show methods --------------------------

    updateRangePickerCalendar(date) {

        const { countOfDays, currentDate } = this.getCountOfDaysInMonth(date);

        const buttons = countOfDays.map(day => {
            return `<button type="button" class="rangepicker__cell" data-value="${currentDate.getDay()}" style="--start-from: 5">${day}</button>`
        }).join('');

        return `
                        <div class="rangepicker__month-indicator">
                                <time datetime="${this.getMonthNameFromDate(currentDate)}">${this.getMonthNameFromDate(currentDate)}</time>
                        </div>
                        <div class="rangepicker__day-of-week">
                                <div>Пн</div>
                                <div>Вт</div>
                                <div>Ср</div>
                                <div>Чт</div>
                                <div>Пт</div>
                                <div>Сб</div>
                                <div>Вс</div>
                        </div>
                        <div class="rangepicker__date-grid">
                                ${buttons}
                        </div>
                    `
    }

    getTemplate() {
        return `
                    <div class="container">
                            <div data-element="rangepicker" class="rangepicker">
                                    <div class="rangepicker__input" data-element="input">
                                        <span data-element="from">${this.from.toLocaleDateString()}</span> -
                                        <span data-element="to">${this.to.toLocaleDateString()}</span>
                                    </div>
                                    <div class="rangepicker__selector" data-element="selector">
                                        <div class="rangepicker__selector-arrow"></div>
                                        <div data-element="control-left" class="rangepicker__selector-control-left"></div>
                                        <div data-element="control-right" class="rangepicker__selector-control-right"></div>
                                        <div data-element="rangepicker-calendar-left" class="rangepicker__calendar">
                                            ${this.updateRangePickerCalendar(this.from)}
                                        </div>
                                        <div data-element="rangepicker-calendar-right" class="rangepicker__calendar">
                                            ${this.updateRangePickerCalendar(this.to)}
                                        </div>
                                    </div>
                            </div>
                    </div>
                `
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.initEventListeners();
    }

    // ------------------------ Events and Listeners ------------------------

    togglePickerVisible(event) {
        const elements = event.target.closest(".rangepicker__input");

        if(elements) {
            this.subElements['rangepicker'].classList.toggle('rangepicker_open');
        }
    }

    changeMonth(action) { // Если переключаемся назад -> from = from - 1 ; вперед to = to + 1
        let changedMonth;
        
        switch(action) {
            case 'prev' : {
                const date = this.from;
                changedMonth = new Date(+date.getFullYear(), +date.getMonth() - 1);
                this.to = this.from;
                this.from = changedMonth;
                break;
            }
            case 'next' : {
                const date = this.to;

                changedMonth = new Date(+date.getFullYear(), +date.getMonth() + 1);
                this.from = this.to;
                this.to = changedMonth;
                break;
            }
        }

        this.calendarLeft = this.subElements['rangepicker-calendar-left'];
        this.calendarRight = this.subElements['rangepicker-calendar-right'];
        this.calendarLeft.innerHTML = this.updateRangePickerCalendar(this.from);
        this.calendarRight.innerHTML = this.updateRangePickerCalendar(this.to);
    }

    initEventListeners() {
        const prevMonthBtn = this.subElements['control-left'];
        const nextMonthBtn = this.subElements['control-right'];
        const rangepicker = this.subElements['rangepicker'];

        prevMonthBtn.addEventListener('click', () => this.changeMonth('prev'));
        nextMonthBtn.addEventListener('click', () => this.changeMonth('next'));
        rangepicker.addEventListener('click', (event) => this.togglePickerVisible(event)); //FIXME Пропадает контекст
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove()
    }

    // ------------------------ Utils functions below ------------------------

    getSubElements(element) {
        const subElements = element.querySelectorAll('[data-element]');
        const result = {}

        subElements.forEach(element => {
            const name = element.dataset['element'];
            result[name] = element;
        })

        return result;
    }

    getCountOfDaysInMonth(date) {
        const prevMonth = new Date(+date.getFullYear(), +date.getMonth() - 1);
        const countOfDays = (date - prevMonth) / 1000 / 60 / 60 / 24;

        return {
            countOfDays: getDaysArray(countOfDays),
            currentDate: date
        };

        // from 31 to [1, 2, 3, ... 31];
        function getDaysArray(days) {
            const daysArray = new Array();
            for (let i = 1; i < countOfDays; i++) { // from 1
                daysArray.push(i);
            }

            return daysArray;
        }
    }

    getMonthNameFromDate(date) {
        const monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        const monthIndex = date.getMonth();
      
        return monthNames[monthIndex];
      }
}
