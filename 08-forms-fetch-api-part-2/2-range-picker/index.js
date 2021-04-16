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
        this.selectedDate; // Это поле отвечает за дату, с которой начинается отсчет
        this.element;
        this.subElements;

        // invoked methods
        this.render();
        this.destroy();
    }

    // -------------------------- Show methods --------------------------

    updateCalendarButtons(countOfDays, currentDate) {
        const buttons = countOfDays.map(day => {
            return `<button type="button" class="rangepicker__cell" data-value="${currentDate.getDay()}" style="--start-from: 5">${day}</button>`
        }).join('');

        return buttons;
    }

    updateCalendar(date) {

        const { countOfDays, currentDate } = this.getCountOfDaysInMonth(date);

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
                <div data-element="date-grid" class="rangepicker__date-grid">
                        ${this.updateCalendarButtons(countOfDays, currentDate)}
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
                                        ${this.updateCalendar(this.from)}
                                    </div>
                                    <div data-element="rangepicker-calendar-right" class="rangepicker__calendar">
                                        ${this.updateCalendar(this.to)}
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

    /**
     * Description:
     * 
     * Нужно выбрать две даты.
     * пользователь выбирает 1ую, если он выбрал устанавливаем ее в this.from,
     * а в вспомогательную переменную this.selectedDate присваиваем this.from.
     * 
     * Если this.selectedDate установлена -  Выбираем 2ую дату, если нет, заново выбираем первую.
     */
    pickDate(event) {
        const cell = event.target.closest(".rangepicker__cell");
        const from = this.subElements["from"];
        const to = this.subElements["to"];

        if (cell) {
            if (this.selectedDate) {
                this.to = cell.dataset.value;

                // update input date
                from.textContent = this.from;
                to.textContent = this.to;

                this.selectedDate = null;
            }
            this.selectedDate = this.from;
            this.from = cell.dataset.value;
        }

        //FIXME make method which update UI with selected cell
    }

    /**
     * Если пользователь кликнул куда угодно но не в поле выбора дат, обнуляем выбранные им ранее даты.
     */
    clearPickedDate(event) {
        const cell = event.target.closest(".rangepicker__cell");
        console.log(cell)
        if (!cell) {
            if (this.selectedDate) {
                this.from = this.selectedDate;
            }
            this.selectedDate = null;
        }
    }

    togglePickerVisible(event) {
        const elements = event.target.closest(".rangepicker__input");

        if (elements) {
            this.subElements['rangepicker'].classList.toggle('rangepicker_open');
        }
    }

    changeCalendarMonth(action) { // Если переключаемся назад -> from = from - 1 ; вперед to = to + 1
        let changedMonth;

        switch (action) {
            case 'prev': {
                const date = this.from;
                changedMonth = new Date(+date.getFullYear(), +date.getMonth() - 1);
                this.to = this.from;
                this.from = changedMonth;
                break;
            }
            case 'next': {
                const date = this.to;

                changedMonth = new Date(+date.getFullYear(), +date.getMonth() + 1);
                this.from = this.to;
                this.to = changedMonth;
                break;
            }
        }

        this.calendarLeft = this.subElements['rangepicker-calendar-left'];
        this.calendarRight = this.subElements['rangepicker-calendar-right'];
        this.calendarLeft.innerHTML = this.updateCalendar(this.from);
        this.calendarRight.innerHTML = this.updateCalendar(this.to);
    }



    initEventListeners() {
        this.prevMonthBtn = this.subElements['control-left'];
        this.nextMonthBtn = this.subElements['control-right'];
        this.rangepicker = this.subElements['rangepicker'];
        this.dateGrid = this.subElements['date-grid'];

        this.prevMonthBtn.addEventListener('click', this.changeCalendarMonth.bind(this, 'prev'));
        this.nextMonthBtn.addEventListener('click', () => this.changeCalendarMonth('next'));
        this.rangepicker.addEventListener('click', this.togglePickerVisible.bind(this, [event]));
        this.dateGrid.addEventListener('click', this.pickDate.bind(this)); //!!!!! Use Bind (Prevent context lose)
        
        document.addEventListener('click', this.clearPickedDate);
    }

    // ------------------------ Destroy methods ------------------------

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove()
        document.removeEventListener('click', this.clearPickedDate); //FIXME Не удаляется!
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
