export default class NotificationMessage {

    static instance;

    constructor(
        message = '',
        {
            duration = '',
            type = ''
        } = {}
    ) {
        if (NotificationMessage.instance) {
            return NotificationMessage.instance;
        }
        NotificationMessage.instance = this;
        this.message = message;
        this.duration = duration;
        this.type = type;
    }

    get template() {
        return `
        <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;

        document.body.append(this.element);
    }

    show() {
        if (!this.element) {
            this.render();
            setTimeout(() => {
                this.destroy();
            }, this.duration)
        }
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        NotificationMessage.instance = null;
    }
}
