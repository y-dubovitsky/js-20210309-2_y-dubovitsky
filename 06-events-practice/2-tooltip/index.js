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

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        this.element = element;
        document.body.appendChild(this.element);
    }

    show(event) {
        switch(event.target) {
            case this.foo : {
                this.message = "foo"; //FIXME Убрать статику
                this.render();
                break;
            }
            case this.bar : {
                this.message = "bar-bar-bar"
                this.render();
                break;
            }
        }
    }

    initialize() {
        this.foo = document.querySelector('div[data-tooltip="foo"]');
        this.bar = document.querySelector('div[data-tooltip="bar-bar-bar"]');

        document.addEventListener('pointerover', this.refShow = function(event) {Tooltip._instance.show(event)})
        this.foo.addEventListener('pointerout', () => this.remove());
    }

    remove() {
        this.element.remove();
    }

}

const tooltip = new Tooltip();

export default tooltip;
