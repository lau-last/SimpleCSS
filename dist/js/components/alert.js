export default class Alert {
    constructor() {
        Alert.init();
    }
    // Initialize all alerts on the page
    static init() {
        document.querySelectorAll('[data-js="alert"]').forEach((alert) => alert.classList.contains('alert-keep')
            ? Alert.bindCloseButton(alert)
            : Alert.removeAfterAnimation(alert));
    }
    // Dispatch a custom event with the alert element as detail
    static emitEvent(target, eventName, alert) {
        target.dispatchEvent(new CustomEvent(eventName, { detail: { element: alert }, bubbles: true }));
    }
    // Remove alert automatically after its animation ends
    static removeAfterAnimation(alert) {
        alert.addEventListener('animationend', () => {
            Alert.emitEvent(alert, 'alert:beforeRemove', alert);
            Alert.finishRemove(alert);
        }, { once: true });
    }
    // Bind close button event for keep alerts
    static bindCloseButton(alert) {
        const closeButtons = alert.querySelectorAll('.close');
        if (!closeButtons.length)
            return;
        closeButtons.forEach(button => button.addEventListener('click', () => {
            Alert.emitEvent(alert, 'alert:beforeRemove', alert);
            Alert.handleKeepAnimation(alert);
        }, { once: true }));
    }
    // Handle the animation when closing a keep alert
    static handleKeepAnimation(alert) {
        const name = getComputedStyle(alert).getPropertyValue('--alert-keep-animation-out').trim();
        if (name) {
            alert.style.animation = name;
            alert.addEventListener('animationend', () => Alert.finishRemove(alert), { once: true });
        }
        else {
            Alert.finishRemove(alert);
        }
    }
    // Remove alert element from DOM and emit afterRemove event
    static finishRemove(alert) {
        alert.remove();
        Alert.emitEvent(document.body, 'alert:afterRemove', alert);
    }
}
