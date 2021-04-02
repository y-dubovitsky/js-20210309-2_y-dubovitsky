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

    addToolTip = (element) => {
        this.message = element.getAttribute('data-tooltip');
        this.render();
    }

    showTooltip(event) {
        switch (event.target.dataset.tooltip) {
            case "bar-bar-bar": {
                this.message = "bar-bar-bar";
                this.render();
                event.stopPropagation();
                break;
            }
            case "foo": {
                this.message = "foo";
                this.render();
                break;
            }
        }
    }

    initialize() {
        const dataToolTips = document.querySelectorAll('[data-tooltip]');

        dataToolTips.forEach(tip => {
            tip.addEventListener('pointerover', event => {
                this.showTooltip(event);
            })
            tip.addEventListener('pointerout', () => {
                this.remove();
            })
        })
    }

    remove() {
        this.element.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
