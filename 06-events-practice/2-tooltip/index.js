class Tooltip {

    static instance;
    static offset = 20;

    constructor() {
        if (!Tooltip.instance) {
            Tooltip.instance = this;
        }
        return Tooltip.instance;
    }

    getTemplate() {
        return `<div class="tooltip">${this.message}</div>`
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper.firstChild;

        document.body.append(this.element);
    }

    onPointerOver = (event) => {
        const target = event.target.closest('[data-tooltip]');

        if (target) {
            this.message = target.dataset.tooltip;
            this.render();
            document.addEventListener('pointermove', this.pointerMove)
        }
    }

    pointerMove = (event) => {
        const { offsetX, offsetY } = event;
        this.setCoordinate(offsetX, offsetY);
    }

    setCoordinate(x, y) {
        this.element.style.left = x + Tooltip.offset + 'px';
        this.element.style.top = y + Tooltip.offset + 'px';
    }

    onPointerOut = () => {
        this.remove();
    }

    initEvents() {
        document.addEventListener('pointerover', this.onPointerOver);
        document.addEventListener('pointerout', this.onPointerOut);
    }

    initialize() {
        this.initEvents();
    }

    remove() {
        if (this.element) { // Проверка, если вдруг елемент не был создан, а курсор выйдет за документ
            this.element.remove();
            // this.element = null;
            document.removeEventListener('pointermove', this.pointerMove)
        }
    }

    destroy() {
        this.remove();
        document.removeEventListener('pointerover', this.onPointerOver);
        document.removeEventListener('pointerout', this.onPointerOut);
    }

}

const tooltip = new Tooltip();

export default tooltip;
