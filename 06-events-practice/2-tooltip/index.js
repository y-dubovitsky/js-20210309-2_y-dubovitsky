class Tooltip {

    constructor() {
        if (!Tooltip._instance) {
            Tooltip._instance = this;
        }
        return Tooltip._instance;
    }

    getTemplate() {
        return `<div class="tooltip">${this.message}</div>`
    }

    render(x, y) {
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        this.element = element.firstChild;

        this.setCoordinate(this.element, x, y);

        document.body.append(this.element);
    }

    setCoordinate(element, x, y) {
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }

    show(event) {
        switch(event.target) {
            case this.foo : {
                this.message = "foo"; //FIXME Убрать статику
                this.render(event.offsetX, event.offsetY);
                break;
            }
            case this.bar : {
                this.message = "bar-bar-bar"
                this.render(event.offsetX, event.offsetY);
                break;
            }
        }
    }

    removeTip(event) {
        if(event.target === this.foo || event.target === this.bar) {
            this.remove();
        }
    }

    initialize() {
        this.foo = document.querySelector('div[data-tooltip="foo"]');
        this.bar = document.querySelector('div[data-tooltip="bar-bar-bar"]');

        document.addEventListener('pointerover', this.refShow = function(event) {Tooltip._instance.show(event)})
        document.addEventListener('pointerout', this.refRemove = function(event) {Tooltip._instance.removeTip(event)});
    }

    remove() {
        this.element.remove();
    }

}

const tooltip = new Tooltip();

export default tooltip;
