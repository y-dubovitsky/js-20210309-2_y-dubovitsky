export default class SortableList {
    
    constructor(
        items = {}
    ) {
        this.items = items.items;

        this.render();
    }

    getTemplate() {
        const ul = document.createElement('ul');

        this.items.forEach((element, index) => {
            element.setAttribute('data-element', `li-${index}`);
            element.classList.add('dragable');
            ul.append(element)
        });

        this.element = ul;
    }


    render() {
        this.getTemplate();

        this.initEventListeners();
    }

    onMouseDown = (event) => {
        this.target = event.target.closest('[data-element]'); //this.target = li элемент

        if (this.target) {
            //FIXME не гибко
            this.shiftX = event.clientX - this.target.getBoundingClientRect().left; // Координаты клика мыши
            this.shiftY = event.clientY - this.target.getBoundingClientRect().top;

            this.target.style.position = 'absolute';
            this.target.style.zIndex = 100;

            this.createPlaceHolder();

            this.element.replaceChild(this.blank, this.target); // Заменяем элемент по которому кликнули на пустышку
            document.addEventListener('pointermove', this.moveElement)
        }
    }

    /**
     * Create placeholder  
     */
    createPlaceHolder = () => {
        this.blank = document.createElement('div');
        this.blank.classList.add('dragable');
        this.blank.style.opacity = 0.5;
    }

    onMouseUp = () => {
        document.removeEventListener('pointermove', this.moveElement);
        if (this.target !== null && this.currentDragable !== null) {
            this.blank.remove(); // Удаляем пустышку, убираем абсолютное позиционирование, перемещаем элемент в ul
            this.setStyleDefault(this.target);
            this.insertElement(this.target);
        }
    }

    moveElement = (event) => {
        if (!this.element.contains(this.target)) { // Если контейнер с drag-n-drop элементами не содержит перетаскиваемый элемент
            this.element.append(this.target); // Добавляем его, чтобы он был виден при перетаскивании
        }
        this.target.style.left = event.pageX - this.shiftX + 'px';
        this.target.style.top = event.pageY - this.shiftY + 'px';

        // Прячем li элемент, смотрим что под ним
        this.target.hidden = true;
        const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        this.target.hidden = false;
        // Находим ближайший перетаскиваемый элемент
        this.currentDragable = elementBelow.closest('.dragable'); // this.currentDragable - элемент, который мы двигаем в данный момент

        if (!this.currentDragable) return;
        // Если НА ДАННЫЙ МОМЕНТ низлежащий элемент != тому элементу который мы перетаскиваем
        if (elementBelow !== this.currentDragable) {
            //TODO Добавить перемещение элементов из списка ul
        }
    }

    initEventListeners = () => {
        document.addEventListener('mousedown', this.onMouseDown)
        document.addEventListener('mouseup', this.onMouseUp)
    }

    setStyleDefault = (element) => {
        element.style.position = '';
        element.style.zIndex = '';
    }

    /**
     * Where insert element, before or after 
     */
    insertElement = (element) => {
        this.element.insertBefore(element, this.currentDragable);
    }
}
