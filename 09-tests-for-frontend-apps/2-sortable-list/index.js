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
        this.target = event.target.closest('[data-element]');

        if (this.target) {
            //FIXME не гибко
            this.shiftX = event.clientX - this.target.getBoundingClientRect().left; // Координаты клика мыши
            this.shiftY = event.clientY - this.target.getBoundingClientRect().top;

            this.target.style.position = 'absolute';
            this.target.style.zIndex = 100;

            this.element.replaceChild(getPlaceHolder(), this.target); // Заменяем элемент по которому кликнули на пустышку
            document.addEventListener('pointermove', this.moveElement)
        }

        function getPlaceHolder() {
            const blank = document.createElement('div');
            blank.classList.add('dragable');
            blank.style.opacity = 0.4;
            
            return blank;
        }
    }

    onMouseUp = () => {
        document.removeEventListener('pointermove', this.moveElement);
    }

    moveElement = (event) => {
        if (!this.element.contains(this.target)) {
            this.element.append(this.target);
        }
        this.target.style.left = event.pageX - this.shiftX + 'px';
        this.target.style.top = event.pageY - this.shiftY + 'px';
    }

    initEventListeners() {
        document.addEventListener('mousedown', this.onMouseDown)
        document.addEventListener('mouseup', this.onMouseUp)
    }
}
