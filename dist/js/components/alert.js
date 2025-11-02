export default class Alert {
    constructor() {
        Alert.init();
    }
    // Initialize all alerts on the page
    static init() {
        document.querySelectorAll('[data-js="alert"]').forEach((alert) => alert.classList.contains('alert-keep')
            ? this.bindCloseButton(alert)
            : this.removeAfterAnimation(alert));
    }
    // Dispatch a custom event with the alert element as detail
    static emitEvent(target, eventName, alert) {
        target.dispatchEvent(new CustomEvent(eventName, { detail: { element: alert }, bubbles: true }));
    }
    // Check if alert has the 'alert-keep' class
    static isKeepAlert(alert) {
        return alert.classList.contains('alert-keep');
    }
    // Remove alert automatically after its animation ends
    static removeAfterAnimation(alert) {
        alert.addEventListener('animationend', () => {
            this.emitEvent(alert, 'alert:beforeRemove', alert);
            this.finishRemove(alert);
        }, { once: true });
    }
    // Bind close button event for keep alerts
    static bindCloseButton(alert) {
        const closeButtons = alert.querySelectorAll('.close');
        if (!closeButtons.length)
            return;
        closeButtons.forEach(button => button.addEventListener('click', () => {
            this.emitEvent(alert, 'alert:beforeRemove', alert);
            this.handleKeepAnimation(alert);
        }, { once: true }));
    }
    // Handle the animation when closing a keep alert
    static handleKeepAnimation(alert) {
        const name = getComputedStyle(alert).getPropertyValue('--alert-keep-animation-out').trim();
        if (name) {
            alert.style.animation = name;
            alert.addEventListener('animationend', () => this.finishRemove(alert), { once: true });
        }
        else {
            this.finishRemove(alert);
        }
    }
    // Remove alert element from DOM and emit afterRemove event
    static finishRemove(alert) {
        alert.remove();
        this.emitEvent(document.body, 'alert:afterRemove', alert);
    }
}
