export default class NotificationMessage {

    static prevNotificationMessage;

    constructor(
        message = '',
        data = {}
    ) {
        this.message = message;
        this.duration = data.duration;
        this.type = data.type;

        this.render(); //FIXME Мб лучше в метод show()?
    }

    get template() {
        return `
        <div class="notification ${this.type}" style="--value:${this.convertMsToSec(this.duration)}s">
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

    convertMsToSec(time) {
        return (time / 1000);
    }

    render() {
        this.removePrevNotification();

        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;

        NotificationMessage.prevNotificationMessage = this.element; //FIXME Нарушает семантику метода
    }

    removePrevNotification() {
        if (NotificationMessage.prevNotificationMessage) {
            NotificationMessage.prevNotificationMessage.remove();
        }
    }

    show(container = document.body) {
        // this.render();
        container.append(this.element);
        setTimeout(() => {
            this.destroy();
        }, this.duration)
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        NotificationMessage.prevNotificationMessage = null;
    }
}
